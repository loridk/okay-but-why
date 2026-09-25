# Episode 8: Composer, Config & Deployment: “But I Changed It in the Admin UI”

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

JULES: The new event field works on my development site.

PARISA: Did you export the configuration?

JULES: I changed it in the admin UI.

PARISA: That was an answer to where you clicked, not where the change is stored.

JULES: I see the shape of my afternoon.

## Three Things Travel Differently

JULES: Welcome to Okay, But Why? Today we move a Drupal site safely between environments. We need to distinguish code, configuration, and content.

PARISA: Code is Drupal core, contributed extensions, our custom modules and themes, and their dependencies. Configuration describes how this site is arranged. Content is the changing information editors manage.

JULES: An Event content type, its field definitions, a View, and display settings are configuration. Moss After Dark, its actual date, its media record, and taxonomy terms are content.

PARISA: The Subject vocabulary definition is configuration; Botany as an actual term is content. That is precisely the kind of detail that causes a deployment surprise if we assume every admin screen edits the same category of data.

JULES: Exactly. The database holds both active configuration and content. “It's in the database” doesn't tell us which deployment mechanism applies.

PARISA: And uploaded file bytes live in file storage, not necessarily in the database at all. We need to account for those separately.

## Composer Manages the Code Dependency Graph

JULES: Composer is the PHP ecosystem's dependency manager. Composer JSON describes requested packages and version constraints. The lock file records the resolved dependency versions.

PARISA: Familiar from npm: a manifest states acceptable dependencies, and a lock file records a particular resolution. The details differ, but the reason for reproducibility is recognizable.

JULES: In Drupal, Composer can manage core, contributed modules and themes, Drush, and third-party PHP libraries. The recommended-project template arranges a project with a web directory as the document root.

PARISA: Keeping the project root above the public web root helps avoid exposing files that the web server shouldn't serve. It still depends on configuring the server correctly.

JULES: Exactly. Composer install uses the lock file when present. Composer update resolves allowed versions again and updates the lock file. Those commands are not interchangeable deployment habits.

PARISA: Production should normally receive a tested dependency set. Running an unrestricted update on the live server asks it to choose new software while serving visitors. That's a very exciting way to discover compatibility issues.

JULES: Teams commonly commit the manifest and lock file and build dependencies in a controlled process. Whether they deploy a built artifact or install from the lock on a target environment depends on their deployment design.

## Core, Contrib, and Custom

PARISA: Contrib means community-provided extensions and related projects. It doesn't mean every project is equally maintained, secure, or compatible.

JULES: Right. Check supported releases, maintenance, compatibility, and security-advisory coverage. The dependency solver can find a compatible package set according to declared constraints; it can't guarantee your custom workflow still behaves correctly.

PARISA: Drupal's core-recommended package pins the versions of core's dependencies to a tested set. Our site's other requirements still matter, and the lock file records the full resolution.

JULES: A Composer package being present also doesn't mean its Drupal module is enabled. Code acquisition and site extension state are separate.

PARISA: And removing a package before properly handling the installed module's configuration and data can leave the site broken. Dependency maintenance includes application lifecycle, not just deleting directories.

[CODE CARD: Typical Composer-managed project shape]
```text
project/
  composer.json
  composer.lock
  config/sync/          exported site configuration
  vendor/               installed PHP dependencies
  web/                  public document root
    core/
    modules/contrib/
    modules/custom/
    themes/contrib/
    themes/custom/
    sites/default/
      settings.php
      files/            managed public uploads, if configured here

Private files and secrets belong in appropriately protected locations.
Git policy for built dependencies varies; do not commit credentials/uploads by accident.
```

## Drush Is an Interface to Drupal Operations

JULES: Drush is command-line tooling for Drupal. It can inspect the site, manage configuration, run updates, rebuild caches, and perform other tasks.

PARISA: Composer manages packages; Drush operates on Drupal. If Composer downloads a module and Drush enables it, those are two different jobs.

JULES: Exactly. A project-local compatible Drush version helps keep commands consistent across a team. Use the version supported by the Drupal and PHP versions you're running.

PARISA: Drupal 11.4 also introduces native command-line improvements. That doesn't make every established Drush workflow obsolete overnight. We should distinguish core tooling from Drush rather than use the names interchangeably.

JULES: And before running commands, confirm the target site and environment. A correct command aimed at the wrong database is still a bad afternoon.

## The UI Edited Active Configuration

PARISA: Let's make the event registration-link field in development. The UI saves its field definition and display settings into active configuration in the database.

JULES: Then configuration export writes the site's exportable configuration to YAML files in the configured sync directory. Git can show the changes as text.

PARISA: YAML is a data format. Drupal defines the meaning of these particular files. YAML itself doesn't know what a view mode is.

JULES: Exactly. We review the exported differences: expected field storage and bundle configuration, form and view display changes, and dependencies. We don't blindly commit every changed file because the export command succeeded.

PARISA: Someone may have experimented with an unrelated View on that same development database. The export can include it. Review is how we keep the deployment about the change we intended.

[TERMINAL]
```sh
# Development environment, from the Composer project root.
vendor/bin/drush status
vendor/bin/drush config:export -y
git diff -- config/sync
git status --short
```

JULES: These commands assume config slash sync is the configured sync directory. Use the actual path for the project. The diff is a review step, not an instruction to commit everything it shows.

PARISA: And configuration export does not export the events people wrote. It doesn't move uploaded photos or create the Botany term on another database.

## Import Is Synchronization, Not Gentle Suggestion

JULES: On the target site, configuration import brings the active configuration into agreement with the synchronized set, subject to validation and dependencies.

PARISA: Including deletions. If a configuration object disappeared from the exported set, the import can remove it. This isn't merely a folder of optional additions.

JULES: Right. That's why we inspect the proposed changes and test them on staging. Removing fields or uninstalling extensions can have consequences for data, not just labels.

PARISA: Drupal's normal configuration synchronization expects related environments of the same site, including matching site identity. Copying a sync directory into an unrelated installation isn't a general-purpose site-cloning strategy.

JULES: Exactly. Recipes, installation workflows, and migrations address different setup or content-transfer needs. Don't disable a validation check without understanding what assumption it protects.

PARISA: And if someone changed the View directly in production, the next import can overwrite that change. We need a policy for production configuration changes and a way to reconcile approved exceptions back into version control.

## Content Goes Through a Different Door

JULES: To move actual content, teams may use database copies, migration tooling, APIs, or carefully designed content deployment workflows. The appropriate choice depends on what direction information travels and what must be preserved.

PARISA: Copying production down to development can be useful, with sanitization for sensitive data. Copying a stale development database up to production can erase new content and accounts. These directions are not symmetric.

JULES: Exactly. A code deployment should not casually replace the database containing editors' current work.

PARISA: If our new feature requires a default taxonomy term, we need an explicit way to create or migrate that content. It doesn't ride along with the vocabulary's YAML merely because the two are related.

JULES: And any data transformation must be repeatable or carefully tracked, handle existing records, and fail clearly. We don't want rerunning a deployment to create twelve copies of Welcome Week.

## Environment-Specific Settings

PARISA: Development should send mail somewhere safe. Production needs its real domain and integrations. Secrets differ. How do we avoid exporting those differences back and forth forever?

JULES: Drupal supports settings and configuration overrides. Environment-specific values can be supplied through protected deployment configuration or environment variables, with the appropriate settings wiring.

PARISA: Overrides can affect the effective runtime value without changing the stored configuration that export sees. So if I look at a settings screen or exported YAML, I need to know whether an override is also active.

JULES: Exactly. An override is not automatically a bidirectional editing system. Teams may use contributed tools such as Config Split for managed subsets, but that's contributed behavior with its own setup, not magic core environment detection.

[CODE CARD: Illustrative settings.php fragment; adapt to the project's deployment policy]
```php
// Keep synchronization files outside the public web root.
$settings['config_sync_directory'] = dirname(DRUPAL_ROOT) . '/config/sync';

// Optional non-secret environment-specific override for demonstration.
$environmentSiteName = getenv('BELLWEATHER_SITE_NAME');
if ($environmentSiteName !== false && $environmentSiteName !== '') {
  $config['system.site']['name'] = $environmentSiteName;
}
```

PARISA: That illustrates a mechanism using a harmless site name. It isn't permission to commit API keys in a settings file. Keep secrets in the approved protected environment or secret store and avoid printing them in logs.

JULES: Also, cache behavior must be appropriate for overrides. A site-wide environment value is different from a per-user dynamic value. Don't smuggle request-dependent personalization into global configuration and assume caches will infer the variation.

## A Deployment Is a Coordinated Change

JULES: Our release includes custom code, a locked dependency set, and exported configuration. It may also need database updates or explicit data transformations.

PARISA: So “copy the PHP files” isn't necessarily enough. The new code may expect an updated schema or a configuration object that hasn't been imported yet.

JULES: A common Drush deployment workflow coordinates database updates, configuration import, cache rebuilding, and deployment hooks in a defined order. Check the installed Drush version's deploy command and the project's documented procedure.

PARISA: Don't combine three unrelated blog-post command lists and run every update step twice. Use one tested sequence for this application.

[TERMINAL]
```sh
# Illustrative release steps for an EXISTING, backed-up staging environment.
# Use the project's tested deployment procedure and correct target site.
composer install --no-dev --prefer-dist --optimize-autoloader
vendor/bin/drush updatedb:status
vendor/bin/drush config:status
vendor/bin/drush deploy -y
vendor/bin/drush status
```

JULES: This isn't a universal production runbook. Artifact deployment, traffic handling, maintenance mode, backups, and recovery depend on the hosting arrangement and the change. The important point is that package installation and Drupal deployment operations are both accounted for.

PARISA: A release might require a maintenance window if old and new code can't safely coexist with a schema transition. Zero downtime is an engineered property, not what happens when we decline to mention downtime.

## Test What Editors and Visitors Need

JULES: On staging, create an event with the new registration link. Save a draft. Review it. Publish it. Check the full page and teaser. Verify anonymous access and the API if the field is exposed there.

PARISA: Then update it with warm caches. Check a role that cannot publish. Check a bad URL and a missing required value. The happy-path green checkmark is only one part of the feature.

JULES: Automated checks can cover code quality, tests, configuration consistency, and dependency advisories. CI means those checks run consistently when changes are proposed or integrated.

PARISA: CD automates the delivery or deployment steps according to the team's process. It doesn't decide that every passing test proves an editorial workflow is pleasant to use.

JULES: Exactly. Automation makes a known process repeatable. It can also repeat a bad process very efficiently.

## Rollback Needs More Than Git

PARISA: Suppose the new code fails. Can we deploy the previous commit?

JULES: Sometimes. But if database updates transformed data or configuration, the old code may no longer match. Code rollback and database rollback are different operations.

PARISA: Restoring a database backup can also discard content created since that backup. The recovery plan must account for the editors who kept working.

JULES: Exactly. Test backups and restoration, document compatibility, and consider forward fixes where appropriate. A backup file that has never been restored is evidence of a file, not proof of recoverability.

PARISA: That sentence has ruined several comforting assumptions, but it is correct.

## The Admin UI Is an Authoring Tool for Configuration

JULES: The realization is simple: changing something through Drupal's admin interface may still change application configuration that needs to move between environments.

PARISA: The UI is one way to author the change. Export, review, version control, and deployment are how the team carries the change reliably.

JULES: Code, configuration, content, files, and secrets have different lifecycles. Keeping those distinctions visible makes releases less mysterious.

PARISA: Next time, Drupal can provide the content without rendering the frontend. Which means we get to distribute the mystery across two applications.

JULES: Or deliberately divide responsibilities.

PARISA: Yes. Let's aim for that one.

[OUTRO MUSIC]

## Production References

- Composer install/update: https://getcomposer.org/doc/01-basic-usage.md
- Drupal Composer workflow: https://www.drupal.org/docs/develop/using-composer/manage-dependencies
- Configuration management: https://www.drupal.org/docs/configuration-management
- Configuration overrides: https://www.drupal.org/docs/drupal-apis/configuration-api/configuration-override-system
- Drush deployment: https://www.drush.org/13.x/deploycommand/
- Drupal 11.4 CLI direction: https://www.drupal.org/blog/drupal-11-4-0
- Commands are illustrative and were not run against a Drupal installation during script production.
