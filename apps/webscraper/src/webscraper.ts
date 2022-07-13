import { prisma } from 'database';
import puppeteer from 'puppeteer';
import type { List } from '@prisma/client';

export default async function Webscraper() {
  //  I initiate browser and wit until page is loaded and return page
  async function getBrowser() {
    const browser = await puppeteer.launch({ headless: true });
    return browser;
  }

  // 'https://arbetsformedlingen.se/platsbanken/annonser?q=front%20end'
  // '.card-container'
  async function getPage(url: string, selector: string) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector);
    return page;
  }

  // go throu page and get items and put them in a list arrar and return the list
  async function getListFromPage(page: puppeteer.Page) {
    const data = await page.evaluate(async () => {
      const list = [];
      const items = document.querySelectorAll('.card-container');
      console.log('items', items);
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
      }
      return list;
    });
    return Promise.all(data);
  }

  async function getDescFromSub(
    data:
      | {
          title: string;
          company: string;
          position: string;
          url: string;
          desc: string;
        }[]
      | undefined,
  ) {
    if (!data) {
      return;
    }
    const newData = data.map(async (element) => {
      const url = `https://arbetsformedlingen.se${element.url}`;
      const selector = '.job-info';
      const newPage = await getPage(url, selector);

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

  const page = await getPage(
    'https://arbetsformedlingen.se/platsbanken/annonser?q=front%20end',
    '.card-container',
  );

  const list = await getListFromPage(page);
  const data = getDescFromSub(list);
  console.log(data);
}
