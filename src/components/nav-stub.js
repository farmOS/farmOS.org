// I'm hardcoding this data until we can get Frontmatter data from GraphQL.
// To update, you can basically take the YAML from https://github.com/farmOS/farmOS/blob/2.x/mkdocs.yml
// and convert it to a JS Array with https://nodeca.github.io/js-yaml/.
const navLinks = [ { Development: 
  [ { API: 
       [ { Introduction: 'development/api/index.md' },
         { Authentication: 'development/api/authentication.md' },
         { Changes: 'development/api/changes.md' } ] },
    { Module: 
       [ { 'Getting started': 'development/module/index.md' },
         { Entities: 'development/module/entities.md' },
         { Fields: 'development/module/fields.md' },
         { OAuth: 'development/module/oauth.md' },
         { Roles: 'development/module/roles.md' },
         { Updates: 'development/module/updates.md' } ] },
    { Environment: 
       [ { 'Getting started': 'development/environment/index.md' },
         { HTTPS: 'development/environment/https.md' },
         { Updating: 'development/environment/update.md' },
         { Docker: 'development/environment/docker.md' },
         { PostgreSQL: 'development/environment/postgresql.md' },
         { Drush: 'development/environment/drush.md' },
         { Composer: 'development/environment/composer.md' },
         { Debugging: 'development/environment/debug.md' },
         { 'Automated tests': 'development/environment/tests.md' },
         { 'Coding standards': 'development/environment/code.md' },
         { Documentation: 'development/environment/documentation.md' } ] } ] },
{ Hosting: 
  [ { Introduction: 'hosting/index.md' },
    { Installing: 'hosting/install.md' },
    { Updating: 'hosting/update.md' },
    { Email: 'hosting/email.md' },
    { '1.x Migration': 'hosting/migration.md' } ] } ];

// The helper functions below are intended to transform this into more of the
// shape I'd like to see this data in from GraphQL.
const pathToUrl = path => `/farmos/docs/${path.replace('index.md', '').replace('.md', '/')}`;
function parseNavObject(navObj) {
  return Object.entries(navObj).map(([key, val]) => {
    // console.log(key, val);
    if (Array.isArray(val)) {
      return {
        title: key,
        url: null,
        children: val.map(parseNavObject),
      };
    }
    return {
      title: key,
      url: pathToUrl(val),
      children: [],
    };
  })[0];
}

const nav = navLinks.map(parseNavObject);

export default nav;
