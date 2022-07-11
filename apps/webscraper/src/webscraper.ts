import { prisma } from 'database';
import puppeteer from 'puppeteer';
import type { List } from '@prisma/client';

export default async function Webscraper() {
  async function setUpBrowser() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      'https://arbetsformedlingen.se/platsbanken/annonser?q=front%20end',
    );
    await page.waitForSelector('.card-container');
    const data = await page.evaluate(() => {
      const list = [];
      const items = document.querySelectorAll('.card-container');
      for (const item of items) {
        list.push({
          title: item.querySelector('.header-container h3')?.innerHTML ?? '',
          company: item.querySelector('.pb-company-name')?.innerHTML ?? '',
          position: item.querySelector('.pb-job-role')?.innerHTML ?? '',
          url:
            item.querySelector('.header-container a')?.getAttribute('href') ??
            '',
          desc: '',
        });

        return list;
      }
    });

    if (data !== undefined) {
      const newPage = await browser.newPage();
      console.log(data[0].url);
      await newPage.goto(`https://arbetsformedlingen.se${data[0].url}`);
      await newPage.waitForSelector('.job-description');
      console.log('tjena');

      const hej = {
        title: 'a',
        company: 'b',
        position: 'b',
        url: 'c',
        desc: 'd',
      };
      return hej;
    }

    async function createList() {
      const title = 'arbetsförmedlingen';
      const theList = await prisma.list.create({
        data: {
          title,
        },
      });
      return theList;
    }

    async function saveDataToList(
      data: {
        title: string;
        company: string;
        position: string;
        url: string;
        desc: string;
      }[],
      list: List,
    ) {
      data.forEach(async (item) => {
        await prisma.listItem.createMany({
          data: {
            title: item.title,
            company: item.company,
            position: item.position,
            url: item.url,
            listId: list.id,
            desc: item.desc,
          },
        });
      });
    }

    const list = await createList();
    const dat = await setUpBrowser();

    if (dat) {
      console.log(dat);
      saveDataToList(dat, list);
    } else return;
  }
}
