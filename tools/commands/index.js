/* eslint-disable global-require */

module.exports = {
    delete: () => require('./delete-fiddle'),
    flush: () => require('./flush-fiddle'),
    import: () => require('./import-fiddle'),
    open: () => require('./open-fiddle'),
    pwf: () => require('./pwf'),
    revise: () => require('./revise-fiddle'),
};
