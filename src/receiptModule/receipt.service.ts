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
        totalPoints += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

        //--> 50 points if the total is a round dollar amount with no cents.
        totalPoints += receipt.total % 1 == 0 ? 50 : 0;

        //--> 25 points if the total is a multiple of of 0.25
        totalPoints += receipt.total % 0.25 == 0 ? 25 : 0;

        // --> 5 points for every two items on the receipt
        totalPoints += Math.floor(receipt.items.length / 2) * 5;

        //--> if item trimmed length of description is multiple of 3 then 
        for (let item of receipt.items){
            let descLength = item.shortDescription.trim().length;
            if(descLength % 3 == 0){
                totalPoints += Math.ceil(item.price * 0.2);
            }
        }
        
        //--> 6 points if the day in the purchase date is odd.
        let day = parseInt((receipt.purchaseDate.split('-'))[2]);
        totalPoints += day % 2!= 0 ? 6 : 0;

        //--> 10 points if the time of purchase is after 2:00pm and before 4:00pm.
        let [hrs, mins] = receipt.purchaseTime.split(':').map(Number);
        totalPoints += (hrs === 14 && mins > 0) || (hrs === 15) ? 10 : 0;
        console.log('total points: ' + totalPoints);
        

        //--> Caching the result 
        let id = uuidv4() //generating unique id
        await this.cacheManager.set(id, totalPoints);
        return {id};
        
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