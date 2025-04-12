import { 
  Controller, 
  Get, 
  Post, 
  Query, 
  UploadedFile, 
  UseInterceptors, 
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { BilletService } from './billet.service';
import { multerOptions } from '../utils/upload-file.util';
import { ReturnImportFileDto } from './dtos/return-update-file.dto';
import { ReturnBilletDto } from './dtos/return-billet.dto';

@Controller('billet')
export class BilletController {
  constructor(private readonly billetService: BilletService) {}

  @Post('/import-csv')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor(
      'csv-file',
      multerOptions
    )
  )
  async importCsv(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    return await this.billetService.importCsv(file)
  };

  @Post('import-pdf')
  @UseInterceptors(
    FileInterceptor(
      'pdf-file', {
      dest: './files',
  }))
  async pdfSeparator(
    @UploadedFile() file: Express.Multer.File
  ): Promise<String[]> {
    return await this.billetService.pdfSeparator(file);
  };

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('initial_price_range') initialPrice?: number,
    @Query('final_price_range') finalPrice?: number,
    @Query('lot_id') lotId?: number,
    @Query('report') report?: string,
  ): Promise<ReturnBilletDto[] | { base64: string }> {
    const boletos = await this.billetService.findAll(
      name,
      initialPrice,
      finalPrice,
      lotId
    );

    if (report === '1') {
      const pdfBuffer = await this.billetService.generateReport(boletos);
      return ({ base64: pdfBuffer.toString('base64') });
    };

    return boletos.map(
      (billet) => new ReturnBilletDto(billet)
    );
  };
}
