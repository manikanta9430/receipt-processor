import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ReceiptService } from "./receipt.service";
import { ReceiptI } from "src/interfaces/receipt.interface";

@Controller('/receipts')
export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService){}

    @Post('/process')
    async processReceipt(@Body() receipt:ReceiptI){
        try {
            return await this.receiptService.processReceipt(receipt);
        } catch (error) {
            return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR) 
        }
    }

    @Get(':id/points')
    async getPointsById(@Param('id') id: string){
        try {
            return await this.receiptService.getPointsById(id);
        } catch (error) {
            return new HttpException(error,HttpStatus.NOT_FOUND); // Sending 'not found' signal if points to particular 'id' isnt found.
        }
    }
}