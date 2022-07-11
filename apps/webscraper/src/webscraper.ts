import { prisma } from 'database';
import puppeteer from 'puppeteer';
import type { List } from '@prisma/client';

export default async function Webscraper() {
  async function setUpBrowser() {
    const browser = await puppeteer.launch({ headless: false });

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

    const newList = data?.forEach(async (element) => {
      const newPage = await browser.newPage();

      await newPage.goto(`https://arbetsformedlingen.se${element.url}`);
      console.log(`https://arbetsformedlingen.se${element.url}`);
      await newPage.waitForSelector('.job-info');

      const data = await newPage.evaluate(() => {
        console.log('Eval');
        const item = document.querySelector('.job-info')?.innerHTML;
        console.log(item);

        console.log('-----');
        console.log({ item });
        console.log('-----');
        return item;
      });
      console.log(data);

      return data;
    });
    return newList;
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
  const data = await setUpBrowser();

  if (data !== undefined) {
    saveDataToList(data, list);
  } else return;
}
