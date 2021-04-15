let adobe = require("@adobe/documentservices-pdftools-node-sdk");

async function applyPassword(password, inputFile, outputFile) {
    try {
        // Initial setup, create credentials instance.
        const credentials =  adobe.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile("./src/pdftools-api-credentials.json")
            .build();

        // Create an ExecutionContext using credentials
        const executionContext = adobe.ExecutionContext.create(credentials);

        // Create new permissions instance and add the required permissions
        const protectPDF = adobe.ProtectPDF,
            protectPDFOptions = protectPDF.options;

        // Build ProtectPDF options by setting an Owner/Permissions Password, Permissions,
        // Encryption Algorithm (used for encrypting the PDF file) and specifying the type of content to encrypt.
        const options = new protectPDFOptions.PasswordProtectOptions.Builder()
                .setUserPassword(password)
                .setEncryptionAlgorithm(protectPDFOptions.EncryptionAlgorithm.AES_256)
                .build();

        // Create a new operation instance.
        const protectPDFOperation = protectPDF.Operation.createNew(options);

        // Set operation input from a source file.
        const input = adobe.FileRef.createFromLocalFile(inputFile);
        protectPDFOperation.setInput(input);

        // Execute the operation and Save the result to the specified location.
        let result = await protectPDFOperation.execute(executionContext);
        result.saveAsFile(outputFile);
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}

async function compileDocFile(json, inputFile, outputPdf) {
    try {
        // configurations
        const credentials =  adobe.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile("./src/pdftools-api-credentials.json")
            .build();

        // Capture the credential from app and show create the context
        const executionContext = adobe.ExecutionContext.create(credentials);

        // create the operation
        const documentMerge = adobe.DocumentMerge,
            documentMergeOptions = documentMerge.options,
            options = new documentMergeOptions.DocumentMergeOptions(json, documentMergeOptions.OutputFormat.PDF);

        const operation = documentMerge.Operation.createNew(options);

        // Pass the content as input (stream)
        const input = adobe.FileRef.createFromLocalFile(inputFile);
        operation.setInput(input);

        // Async create the PDF
        let result = await operation.execute(executionContext);
        await result.saveAsFile(outputPdf);
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}

async function createPdf(rawFile, outputPdf) {
    try {
        // configurations
        const credentials =  adobe.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile("./src/pdftools-api-credentials.json")
            .build();

        // Capture the credential from app and show create the context
        const executionContext = adobe.ExecutionContext.create(credentials),
            operation = adobe.CreatePDF.Operation.createNew();

        // Pass the content as input (stream)
        const input = adobe.FileRef.createFromLocalFile(rawFile);
        operation.setInput(input);

        // Async create the PDF
        let result = await operation.execute(executionContext);
        await result.saveAsFile(outputPdf);
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}

async function combinePdf(pdfs, outputPdf) {
    try {
        // configurations
        const credentials = adobe.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile("./src/pdftools-api-credentials.json")
            .build();

        // Capture the credential from app and show create the context
        const executionContext = adobe.ExecutionContext.create(credentials),
            operation = adobe.CombineFiles.Operation.createNew();

        // Pass the PDF content as input (stream)
        for (let pdf of pdfs) {
            const source = adobe.FileRef.createFromLocalFile(pdf);
            operation.addInput(source);
        }

        // Async create the PDF
        let result = await operation.execute(executionContext);
        await result.saveAsFile(outputPdf);
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}

module.exports = {
    compileDocFile: compileDocFile,
    createPdf: createPdf,
    combinePdf: combinePdf,
    applyPassword: applyPassword
}
