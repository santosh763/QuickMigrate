#!/usr/bin/env node
const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const program = new Command();

// Function to read stored credentials
function readCredentials() {
  const filePath = path.join(__dirname, 'credentials.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    const credentials = JSON.parse(data);
    console.log('Stored Credentials:', credentials);
  } else {
    console.log('No credentials found.');
  }
}

// Main function
async function main(action) {
  if (action === 'login') {
    const { selection } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'Please choose an option:',
        choices: ['Source', 'Target'],
      },
    ]);

    console.log(`You selected: ${selection}`);

    // Capture user ID and password for the selected option
    const credentials = await inquirer.prompt([
      {
        type: 'input',
        name: 'userId',
        message: `Enter your User ID for ${selection}:`,
      },
      {
        type: 'password',
        name: 'password',
        message: `Enter your Password for ${selection}:`,
        mask: '*', // Show '*' for each character typed
      },
    ]);

    // Store credentials
    const filePath = path.join(__dirname, 'credentials.json');
    const allCredentials = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {};

    // Save the credentials for the selected option
    allCredentials[selection] = credentials;

    // Now ask for the other option
    const otherSelection = selection === 'Source' ? 'Target' : 'Source';
    const otherCredentials = await inquirer.prompt([
      {
        type: 'input',
        name: 'userId',
        message: `Enter your User ID for ${otherSelection}:`,
      },
      {
        type: 'password',
        name: 'password',
        message: `Enter your Password for ${otherSelection}:`,
        mask: '*', // Show '*' for each character typed
      },
    ]);

    // Save the other credentials
    allCredentials[otherSelection] = otherCredentials;

    // Write all credentials to the file
    fs.writeFileSync(filePath, JSON.stringify(allCredentials, null, 2));

    console.log('Credentials saved successfully!');
  } else if (action === 'view') {
    readCredentials();
  }
}

// Define commands
program
  .version('1.0.0')
  .description('QuicqMigrate CLI for managing user credentials')
  .command('login')
  .description('Log in to either Source or Target. You will be prompted for your User ID and Password.')
  .action(() => main('login'));

// program
//   .command('view')
//   .description('Display stored credentials saved in credentials.json.')
//   .action(() => main('view'));

// Default action: if no command is provided, run login
if (!process.argv.slice(2).length) {
  main('login'); // Automatically show the login prompt
} else {
  program
    .command('help')
    .description('Display detailed help information about the QuicqMigrate CLI.')
    .action(() => {
      console.log(`
      QuicqMigrate CLI Help:

      Commands:
        login       Log in to Source or Target.
        view        View stored credentials.

      Use 'quicqmigrate [command] --help' for more information on a command.
      `);
    });

  program.parse(process.argv);
}
