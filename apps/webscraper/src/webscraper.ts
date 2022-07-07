import { prisma } from 'database';
import puppeteer from 'puppeteer';
import type { List } from '@prisma/client';

export default async function Webscraper() {
  async function setUpPuppeteer() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      'https://arbetsformedlingen.se/platsbanken/annonser?q=front%20end',
    );
    await page.waitForSelector('.card-container');
    return page;
  }

  async function getDataFromPage() {
    const page = await setUpPuppeteer();

    const data = await page.evaluate(() => {
      const list = [];
      const items = document.querySelectorAll('.card-container');
      for (const item of items) {
        list.push({
          title: item.querySelector('.header-container h3')?.innerHTML ?? '',
          company: item.querySelector('.pb-company-name')?.innerHTML ?? '',
          position: item.querySelector('.pb-job-role')?.innerHTML ?? '',
          url: item.querySelector('.header-container a href')?.innerHTML ?? '',
        });
      }
      return list;
    });

    return data;
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
    data: { title: string; company: string; position: string; url: string }[],
    list: List,
  ) {
    console.log('---SAVE-DATA---');
    console.log(data);
    console.log(list.id);
    console.log('---SAVE-DATA---');
    data.forEach(async (item) => {
      await prisma.listItem.createMany({
        data: {
          title: item.title,
          company: item.company,
          position: item.position,
          url: item.url,
          listId: list.id,
        },
      });
    });
  }

  const data = await getDataFromPage();
  const list = await createList();
  saveDataToList(data, list);
}
