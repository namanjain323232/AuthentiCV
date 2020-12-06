// let fs = require('fs'),
// PDFParser = require("pdf2json");

// let pdfParser = new PDFParser(this,1);

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", pdfData => {
//    fs.writeFile("./abc.json", JSON.stringify(pdfData));
// });

// pdfParser.loadPDF("./resume.pdf");

// var pdfUtil = require('pdf-to-text');
// var pdf_path = "./resume.pdf";
 
// pdfUtil.info(pdf_path, function(err, info) {
//     if (err) throw(err);
//     console.log(info);
// });

// const pdfjsLib = require("pdfjs-dist");

// async function GetTextFromPDF(path) {
//     let doc = await pdfjsLib.getDocument(path).promise;
//     let page1 = await doc.getPage(1);
//     let content = await page1.getTextContent();
//     let strings = content.items.map(function(item) {
//         return item.str;
//     });
//     console.log(strings);
// }

// GetTextFromPDF('./resume.pdf');

var textract = require('textract');

textract.fromFileWithPath("./resume.pdf", function( error, text ) {
   console.log(text);
})