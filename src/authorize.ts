const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromepath = require('chromedriver').path;
import * as path from 'path';
import * as vscode from 'vscode';
import { db, initDb } from './db';

export class Login {
    public driver:any;
    constructor() {
    }

    public async authorize(stdid: string) {
        console.log("Authorizing...");
        const options = new chrome.Options();
        const service = new chrome.ServiceBuilder(chromepath).build();
        this.driver = chrome.Driver.createSession(options, service);
        await this.driver.get("https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/view");
        const element = await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('tab-2'))), 10000);
        await element.click();
        
        const idform = await this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('fido2_login_id'))), 10000);
        await idform.sendKeys(stdid);
        await this.driver.findElement(By.id('btnIDTokenCreateFido2')).click();

        await this.driver.sleep(10000); // TODO : this is a temporary solution. Need to find a way to wait for the user to input the OTP.
        console.log("Authorized!");
    }

    public async getDashboard() { 
        console.log("Getting dashboard...");
        await this.driver.navigate().to("https://myetl.snu.ac.kr/");
        const course = await this.driver.wait(until.elementsLocated(By.className('ic-DashboardCard')), 10000);
        let courseList = [];
        for (let content of course) {
            let coursename = await content.getAttribute('aria-label');
            let semester = await content.findElement(By.className('ic-DashboardCard__header-term')).getText();
            let link = await content.findElement(By.className('ic-DashboardCard__link')).getAttribute('href');
            courseList.push(coursename);
            db.push(`/course/${coursename}`, 
                {
                    "semester": semester,
                    "link": link
            });
        };
        db.push(`/courselist`, courseList);
        console.log("Got dashboard!");
        return course;
    }

    public async getAnnouncement(course: string) {
        console.log("Getting announcement...");
        const coursenum: string = await db.getData(`/course/${course}/link`);
        console.log(coursenum);
        await this.driver.navigate().to(coursenum + "/announcements");
        const element = await this.driver.wait(until.elementsLocated(By.className('ic-item-row ic-announcement-row')), 10000);
        let announcement = [];
        console.log("print 1");
        for (let i=0; i<element.length; i++) {
            let title = await element[i].findElement(By.css('.ic-item-row__content-link-container h3')).getText();
            let date = await element[i].findElement(By.css('.ic-item-row__meta-content-timestamp p')).getText();
            let link = await element[i].findElement(By.className('ic-item-row__content-link')).getAttribute('href');
            announcement.push({
                "title": title,
                "date": date,
                "link": link
            });
        };
        db.push(`/course/${course}/announcement`, announcement);
    }

    public async getModule(course: string) {
        console.log("Getting module...");
        const coursenum:string = await db.getData(`/course/${course}/link`);
        await this.driver.navigate().to(coursenum + "/modules");
        const element = await this.driver.wait(until.elementsLocated(By.css('.context_modules > div')), 10000);
        let module = [];
        for (let i=0; i<element.length; i++) {
            let modulename = await element[i].findElements(By.css('.ig-header header > h2')).getText();
            let contentElements = await element[i].findElements(By.className('ig-title'));

            let content = await contentElements.map(async (el: any) => await el.getText());
            let link = await contentElements.map(async (el: any) => await el.getAttribute('href'));
            module.push({
                "modulename": modulename,
                "content": content,
                "link": link
            });
        };
        db.push(`/course/${course}/module`, module);
    }

    public async getAssignment(course: string) {
        console.log("Getting assignment...");
        const coursenum = await db.getData(`/course/${course}/link`);
        await this.driver.navigate().to(coursenum + "/assignments");
        const element = await this.driver.wait(until.elementsLocated(By.className('item-group-condensed')), 10000);
        let assignment = [];
        for (let i=0; i<element.length; i++) {
            let dataid:string = await element[i].findElement(By.tagName('div')).getAttribute('data-id');
            const title = await element[i].findElement(By.className('element_toggler accessible-toggler')).getText();
            const percentage = await element[i].findElement(By.css('.pill li')).getText();
            
            let eachAssignment = [];
            const contents = element[i].findElements(By.className('assignment'));
            for (let j of contents) {
                const info = await j.findElement(By.css('.ig-info a'));
                const link = await info.getAttribute('href');
                const contentName = await info.getText();

                const detail = await j.findElement(By.className('ig-detail'));
                const isClosed = await detail.findElement(By.className('status-description')).getText();
                const dueDate = await j.findElement(By.css('.assignment-date-due .screenreader-only')).getText();
                const score =  await j.findElement(By.css('.js-score .score-display')).getText();
                const myscore = await j.findElement(By.css('.js-score .score-display b')).getText();
                eachAssignment.push({
                    "link": link,
                    "contentName": contentName,
                    "isClosed": isClosed,
                    "dueDate": dueDate,
                    "score": score,
                    "myscore": myscore
                });
            }
            assignment.push({
                "title": title,
                "percentage": percentage,
                "assignment": eachAssignment
            });
        };
        db.push(`/course/${course}/assignment`, assignment);
    }

    public async getFiles(course: string) {
        console.log("Getting files...");
        const coursenum = await db.getData(`/course/${course}/link`);
        await this.driver.navigate().to(coursenum + "/afiles");
        const element = await this.driver.wait(until.elementsLocated(By.className('ef-item-row')), 10000);
        let assignment = [];
        for (let i=0; i<element.length; i++) {
            let title = await element[i].findElement(By.className('ef-name-col__text')).getText();
            let link = await element[i].findElement(By.className('ef-name-col__link')).getAttribute('href');
            let createdDate = await element[i].findElement(By.css('.ef-date-created-col span span')).getText();
            let modifiedDate = await element[i].findElement(By.css('.ef-date-modified-col span span')).getText();
            let size = await element[i].findElement(By.className('ef-size-col')).getText();
            assignment.push({
                "title": title,
                "link": link,
                "createdDate": createdDate,
                "modifiedDate": modifiedDate,
                "size": size
            });
        };
        db.push(`/course/${course}/assignment`, assignment);
    }
    async main() {
        initDb();
        await this.authorize("hometogo0625");
        //await this.getDashboard();
        let courses = await db.getData(`/courselist`);
        for (let course of courses) {
            await this.getAnnouncement(course);
            await this.getModule(course);
            await this.getAssignment(course);
            await this.getFiles(course);
        }
    }
}

let login = new Login();
login.main();