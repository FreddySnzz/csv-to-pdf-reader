import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { PDFDocument as PDFLibDocument } from 'pdf-lib';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as csv from 'csv-parse';

import { BilletEntity } from './entities/billet.entity';
import { BilletRepository } from './billet.repository';
import { LotRepository } from '../lot/lot.repository';
import { CreateBilletDto } from './dtos/create-billet.dto';
import { PdfOrderEnum } from './enum/pdf-order.enum';


@Injectable()
export class BilletService {
  constructor(
    private readonly billetRepository: BilletRepository,
    private readonly lotRepository: LotRepository,
  ) {}

  private async processCsvRow(
    row: any, 
    importErrors: any[]
  ): Promise<void> {
    const billet = {
      printed_name: row.nome,
      lot_id: row.unidade,
      price: parseFloat(row.valor),
      typeable_line: row.linha_digitavel,
    };
    
    try {
      await this.createBillet(billet);
    } catch (error) {
      importErrors.push({
        nome: billet.printed_name,
        lote: billet.lot_id,
        motivo: error.message,
      });
    };
  }
  
  async importCsv(
    file: Express.Multer.File
  ): Promise<any> {
    const filePath = join(
      process.cwd(),
      'files',
      file.filename
    );

    const importErrors = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
      .pipe(csv.parse({ 
        delimiter: ';', 
        columns: true, 
        trim: true 
      }))
      .on('data', async (row) => {
        try {
          await this.processCsvRow(row, importErrors);
        } catch (e) {
          console.error('Erro inesperado ao processar uma linha:', e);
        };
      })
      .on('end', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Erro ao deletar o arquivo:', err);
          }
        });
        resolve({  
          success: true,
            message: 'Arquivo importado com sucesso.',
            errors: importErrors,
          });
        })
        .on('error', (error) => {
          console.error('Erro ao processar CSV:', error);
          reject(error);
        });
    });
  };

  async createBillet(
    createBilletDto: CreateBilletDto
  ): Promise<BilletEntity> {
    const lotEntity = await this.lotRepository
      .findByName(createBilletDto.lot_id);

    return this.billetRepository.saveBillet(
      createBilletDto, 
      lotEntity
    );
  };

  async findAll(
    name?: string, 
    initialPrice?: number, 
    finalPrice?: number, 
    lotId?: number
  ): Promise<BilletEntity[]> {
    return this.billetRepository.findAll(
      name, 
      initialPrice, 
      finalPrice, 
      lotId
    );
  };

  async generateReport(
    boletos: BilletEntity[]
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 30 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(14).text('Relatório de Boletos', { align: 'center' }).moveDown(1);

      doc.fontSize(10);

      // Cabeçalho
      doc.text('ID', 50, doc.y, { width: 40 });
      doc.text('Nome', 90, doc.y, { width: 120 });
      doc.text('ID Lote', 210, doc.y, { width: 50 });
      doc.text('Valor', 260, doc.y, { width: 60 });
      doc.text('Linha Digitável', 320, doc.y, { width: 180 });
      doc.text('Data', 500, doc.y, { width: 80 });
      doc.moveDown(0.5);

      // Linha separadora
      doc.moveTo(50, doc.y).lineTo(580, doc.y).stroke().moveDown(0.5);

      // Dados
      boletos.forEach((boleto) => {
        doc.text(boleto.id.toString(), 50, doc.y, { width: 40 });
        doc.text(boleto.printed_name, 90, doc.y, { width: 120 });
        doc.text(boleto.lot_id.toString(), 210, doc.y, { width: 50 });
        doc.text(boleto.price.toFixed(2), 260, doc.y, { width: 60 });
        doc.text(boleto.typeable_line, 320, doc.y, { width: 180 });
        doc.text(
          boleto.created_at ? boleto.created_at.toISOString().split('T')[0] : 'N/A',
          500,
          doc.y,
          { width: 80 }
        );
        doc.moveDown(0.5);

      });

      // Linha separadora
      doc.moveTo(50, doc.y).lineTo(580, doc.y).stroke().moveDown(0.5);

      doc.end();
    });
  };

  async pdfSeparator(
    file: Express.Multer.File
  ): Promise<string[]> {
    const filePath = join(
      process.cwd(), 
      'files', 
      file.filename
    );

    const outputFolder = join(process.cwd(), 'files-pdf');

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    };

    const buffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFLibDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    const savedFiles: string[] = [];

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFLibDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfId = (i + 1) as PdfOrderEnum;
      const filename = `${pdfId}.pdf`;

      const pdfBytes = await newPdf.save();
      const finalPath = join(outputFolder, filename);
      fs.writeFileSync(finalPath, pdfBytes);

      savedFiles.push(finalPath);
    };

    fs.unlinkSync(filePath);

    return savedFiles;
  };
}
