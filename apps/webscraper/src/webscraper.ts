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
    const k = await subPage(data, browser);
    return k;
  }

  async function subPage(
    data:
      | {
          title: string;
          company: string;
          position: string;
          url: string;
          desc: string;
        }[]
      | undefined,
    browser: puppeteer.Browser,
  ) {
    if (!data) {
      return;
    }
    const newData = data.map(async (element) => {
      const newPage = await browser.newPage();
      await newPage.goto(`https://arbetsformedlingen.se${element.url}`);
      await newPage.waitForSelector('.job-info');

      const subdata = await newPage.evaluate(() => {
        const item = document.querySelector('.job-info')?.innerHTML;

        return item;
      });

      if (subdata !== undefined) {
        element.desc = subdata;
      } else console.log('UNDEFINED');
      return element;
    });

    return Promise.all(newData);
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
    console.log('checking');
    console.log(data);
    console.log('checking');

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
  console.log('c');
  console.log(data);
  console.log('c');

  if (data !== undefined) {
    saveDataToList(data, list);
  } else return;
}
