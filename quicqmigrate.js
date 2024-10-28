#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const program = new Command();

program
  .name('quicqmigrate')
  .description('Demo CLI for QuicqMigrate login')
  .action(async () => {
    console.log('Welcome to QuicqMigrate!');

    // Prompt for source or target selection
    const { selection } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'Please choose your source or target:',
        choices: ['Source', 'Target'],
      },
    ]);

    // Prompt for user ID and password for the selected option
    async function loginFor(option) {
      console.log(`Logging into ${option}...`);
      const { userId, password } = await inquirer.prompt([
        {
          type: 'input',
          name: 'userId',
          message: `Enter ${option} User ID:`,
        },
        {
          type: 'password',
          name: 'password',
          message: `Enter ${option} Password:`,
          mask: '*',
        },
      ]);
      console.log(`${option} login successful for user: ${userId}`);
    }

    // Perform login for the chosen selection
    await loginFor(selection);

    // Perform login for the other option
    const otherOption = selection === 'Source' ? 'Target' : 'Source';
    await loginFor(otherOption);

    // Final success message
    console.log('Both Source and Target logins completed successfully!');
  });

program.parse(process.argv);
