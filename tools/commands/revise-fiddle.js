// revise-fiddle renames the current fiddle by change the version suffix

const workspace = require('../utils/workspace');

const workspaceJSON = workspace.load();
let fiddle = workspaceJSON.fiddle;

if (!fiddle)
{
    console.error('The current fiddle is untitled. Cannot revise');

    return;
}

const currentSuffix = fiddle.match(/-([1-9])+$/);
let currentVersion = 0;

if (currentSuffix && currentSuffix.length)
{
    currentVersion = Number.parseInt(currentSuffix[0].slice(1), 10);

    if (isNaN(currentVersion))
    {
        currentVersion = 0;
    }
}

++currentVersion;

if (currentSuffix)
{
    fiddle = fiddle.replace(/-([1-9])+$/, `-${currentVersion}`);
}
else
{
    fiddle += `-${currentVersion}`;
}

workspaceJSON.fiddle = fiddle;

console.info(`New fiddle name: ${fiddle}`);

workspace.flush(workspaceJSON);
