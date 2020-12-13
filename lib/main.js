const commands = require('../tools/commands');

async function main()
{
    const cmd = process.argv[2];

    if (commands[cmd])
    {
        commands[cmd]();
    }
}

main();