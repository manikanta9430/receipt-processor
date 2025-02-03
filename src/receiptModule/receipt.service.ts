import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { ReceiptI } from "src/interfaces/receipt.interface";
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager'
@Injectable()
export class ReceiptService {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}


    async processReceipt(receipt: ReceiptI){
        try {
            let totalPoints = 0;
    
            //--> One point for every alphanumeric in retailer name
            let retailerPoints = (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;
            totalPoints += retailerPoints;
            console.log(`\n\n${retailerPoints} points - retailer name (${receipt.retailer}) has ${retailerPoints} alphanumeric characters`);
    
            //--> 50 points if the total is a round dollar amount with no cents.
            if (receipt.total % 1 == 0) {
                totalPoints += 50;
                console.log(`50 points - total is a round dollar amount`);
            }
    
            //--> 25 points if the total is a multiple of 0.25
            if (receipt.total % 0.25 == 0) {
                totalPoints += 25;
                console.log(`25 points - total is a multiple of 0.25`);
            }
    
            // --> 5 points for every two items on the receipt
            let itemPoints = Math.floor(receipt.items.length / 2) * 5;
            totalPoints += itemPoints;
            console.log(`${itemPoints} points - ${receipt.items.length} items at (${Math.floor(receipt.items.length / 2)} pairs @ 5 points each)`);
    
            //--> if item trimmed length of description is multiple of 3 then 
            for (let item of receipt.items) {
                let descLength = item.shortDescription.trim().length;
                if (descLength % 3 == 0) {
                    let descPoints = Math.ceil(item.price * 0.2);
                    totalPoints += descPoints;
                    console.log(`${descPoints} points - item "${item.shortDescription.trim()}" has description length ${descLength}, multiple of 3`);
                }
            }
    
            //--> 6 points if the day in the purchase date is odd.
            let day = parseInt((receipt.purchaseDate.split('-'))[2]);
            if (day % 2 != 0) {
                totalPoints += 6;
                console.log(`6 points - purchase date ${receipt.purchaseDate} has odd day (${day})`);
            }
    
            //--> 10 points if the time of purchase is after 2:00pm and before 4:00pm.
            let [hrs, mins] = receipt.purchaseTime.split(':').map(Number);
            if ((hrs === 14 && mins > 0) || (hrs === 15)) {
                totalPoints += 10;
                console.log(`10 points - purchase time ${receipt.purchaseTime} is between 2:00pm and 4:00pm`);
            }
            console.log(`+ ---------\n= ${totalPoints} Points\n \n------------------------------------------------------------------------------------------------`);
    
            //--> Caching the result 
            let id = uuidv4(); // generating unique id
            await this.cacheManager.set(id, {points: totalPoints});
            return { id };
    
        } catch (error) {
            throw error;
        }
    }

    async getPointsById(id: string){
        try {
            return await this.cacheManager.get(id);
        } catch (error) {
            throw error;
        }
    }

}