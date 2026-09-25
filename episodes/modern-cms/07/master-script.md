# Episode 7: Modules, Hooks, Services & Symfony: Wait, Which Part Is Drupal?

**Series:** Modern CMS Development
**Hosts:** Parisa, Jules
**Production:** September 2026. Audio-first finished script; recording handled separately.

[INTRO MUSIC]

PARISA: This file has a namespace, a constructor, an attribute, a service, and something called a route match.

JULES: What does it do?

PARISA: Displays one helpful sentence.

JULES: Is the sentence very helpful?

PARISA: It had better be. It has a support staff.

## Several Layers, One Application

JULES: Welcome to Okay, But Why? Today we extend Drupal, and we keep asking which layer supplied the thing we're looking at.

PARISA: PHP is the programming language. Namespaces, classes, interfaces, typed parameters, and attributes are PHP features. Drupal defines APIs and conventions using those features.

JULES: Symfony supplies reusable PHP components that Drupal uses, including parts of request handling, routing, dependency injection, and event dispatch. Drupal builds its own application behavior and integration around them.

PARISA: Composer manages PHP packages and autoloading. It doesn't execute our route as some separate CMS. Twig handles templates. JavaScript runs the browser-side behavior when we send it to the browser.

JULES: Exactly. A class can use Symfony interfaces, Drupal services, and PHP syntax in the same file. That's composition across layers, not evidence that every imported name means we installed another application.

PARISA: Modern Drupal has used Symfony foundations since Drupal 8. We're not pretending dependency injection suddenly arrived in Drupal 11.

JULES: Right. Drupal 10 and 11 continue that architecture, updating dependencies and APIs. Drupal 11 began with PHP 8.3 as its minimum and the Symfony 7 generation. Check the requirements for the exact minor release you're operating.

## A Module Is a Package of Drupal Functionality

PARISA: A module can add routes, permissions, services, plugins, hooks, configuration, and other behavior. It isn't necessarily one class or one file.

JULES: Its info YAML file tells Drupal what it is and what core versions it supports. Installing the code through Composer is distinct from enabling the module in the site.

PARISA: Like having a package on disk versus registering its behavior in the application. Drupal's extension lifecycle can also install configuration or storage, so enable and disable aren't casual equivalents of including a PHP file.

JULES: Exactly. Uninstalling a module can remove configuration or data it owns. Read its behavior and dependencies before treating uninstall as a harmless troubleshooting toggle.

PARISA: And don't edit core or a downloaded contributed module to customize the site. Use the extension mechanisms or a tracked, deliberate patch workflow when genuinely necessary. Otherwise the next dependency update eats your fix.

## Route to Controller to Output

JULES: A route maps a request to behavior. It has a path, defaults such as a controller, and requirements such as permissions.

PARISA: The controller is the code that handles the request. For an HTML page, it often returns a render array. Drupal integrates that result into a response.

JULES: Yes. The route permission checks whether someone may enter that route. If the controller loads particular entities or fields, their access rules may require additional checks.

PARISA: A general permission to access content doesn't authorize viewing every unpublished event. Route access and record access are related but separate.

JULES: Our complete small module below displays a greeting derived from the site's configured name. It doesn't load private entities or accept user input. That lets us focus on route and service wiring without hiding an access-control implementation offscreen.

[CODE CARD: Complete demonstration module layout, Drupal 11.1+]
```text
web/modules/custom/bellweather_tools/
  bellweather_tools.info.yml
  bellweather_tools.routing.yml
  bellweather_tools.services.yml
  src/
    Controller/WelcomeController.php
    Service/WelcomeBuilder.php
```

[CODE CARD: bellweather_tools.info.yml]
```yaml
name: Bellweather Tools
type: module
description: Demonstrates a route and an injected presentation service.
package: Custom
core_version_requirement: ^11.1
```

[CODE CARD: bellweather_tools.routing.yml]
```yaml
bellweather_tools.welcome:
  path: '/bellweather/welcome'
  defaults:
    _controller: '\Drupal\bellweather_tools\Controller\WelcomeController::build'
    _title: 'Bellweather welcome'
  requirements:
    _permission: 'access content'
```

[CODE CARD: bellweather_tools.services.yml]
```yaml
services:
  bellweather_tools.welcome_builder:
    class: Drupal\bellweather_tools\Service\WelcomeBuilder
    arguments: ['@config.factory']
```

## Services Have a Construction Plan

PARISA: Translate service: reusable application functionality managed by a service container. The container knows how to construct it and supply what it needs.

JULES: Exactly. Our presentation service needs Drupal's configuration factory. The services YAML says which class implements our service and which existing service to pass into its constructor.

PARISA: Dependency injection means the object receives its collaborator instead of reaching out to a global variable or constructing everything itself.

JULES: Right. It makes dependencies visible and can make testing easier. A service that needs a mail sender can receive a test double instead of sending real mail during a unit test.

PARISA: It also makes the responsibility reviewable. If my heading renderer suddenly requires six database services and the finance system, something interesting has happened to the scope.

JULES: Our example uses constructor property promotion. That's PHP syntax that declares and initializes a property from a constructor parameter. It replaces separate property declaration and assignment boilerplate.

[CODE CARD: src/Service/WelcomeBuilder.php]
```php
<?php

namespace Drupal\bellweather_tools\Service;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Config\ConfigFactoryInterface;

final class WelcomeBuilder {
  public function __construct(
    private readonly ConfigFactoryInterface $configFactory,
  ) {}

  public function build(): array {
    $site = $this->configFactory->get('system.site');
    $build = [
      '#plain_text' => 'Welcome to ' . (string) $site->get('name') . '.',
    ];
    CacheableMetadata::createFromObject($site)->applyTo($build);
    return $build;
  }
}
```

PARISA: This is deliberately an English demonstration string. A real multilingual feature would use Drupal's translation facilities. It does carry the configuration dependency, so cached output knows the site name can change.

JULES: Exactly. The service returns prepared output because it's a presentation service. Other services might return domain data or perform an operation. Service doesn't mean one mandatory return type.

[CODE CARD: src/Controller/WelcomeController.php]
```php
<?php

namespace Drupal\bellweather_tools\Controller;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\bellweather_tools\Service\WelcomeBuilder;
use Symfony\Component\DependencyInjection\ContainerInterface;

final class WelcomeController implements ContainerInjectionInterface {
  public function __construct(
    private readonly WelcomeBuilder $welcomeBuilder,
  ) {}

  public static function create(ContainerInterface $container): static {
    return new static($container->get('bellweather_tools.welcome_builder'));
  }

  public function build(): array {
    return $this->welcomeBuilder->build();
  }
}
```

JULES: The controller factory gets the service at the construction boundary. The controller's working method then uses its injected collaborator. You'll encounter other supported construction and autowiring patterns too; this one makes the wiring explicit.

PARISA: So the service container isn't being consulted on every line as a universal object vending machine. We declare what the object needs when it's created.

JULES: Exactly. Drupal's global service locator appears in existing code and can be useful in procedural contexts, but injecting dependencies into suitable classes generally makes their needs clearer.

[TERMINAL]
```sh
# Existing disposable Drupal 11.1+ site, from the project root.
# Assumes compatible Drush is installed through Composer.
vendor/bin/drush en bellweather_tools -y
vendor/bin/drush cr
# Visit /bellweather/welcome as a user with access content permission.
```

PARISA: We separated this greeting into a service to teach the connection. Don't infer that every one-line controller deserves another abstraction in a real project. Reuse, testing, and responsibility should justify the split.

## Plugins Are Selectable Implementations

JULES: Drupal plugins solve another extension problem: define a type of behavior and discover multiple implementations. Block plugins, field widgets, and field formatters are examples.

PARISA: So a plugin type describes a contract, and particular plugins provide implementations. A manager discovers and creates them.

JULES: Exactly. A field formatter plugin might provide one way to display a field. A block plugin might produce a particular reusable panel. They can use services through supported injection patterns.

PARISA: Drupal plugin is also different from a WordPress plugin. A WordPress plugin is closer to a Drupal module in packaging terms. Drupal uses plugin for a more specific discoverable extension mechanism.

JULES: Excellent translation. And modern Drupal plugin discovery increasingly uses PHP attributes for supported plugin types. Older implementations may use annotation comments or other discovery mechanisms. Read the specific plugin type's API.

PARISA: An attribute is structured metadata attached using PHP syntax. The Drupal attribute class and the plugin manager give that metadata its Drupal meaning. PHP doesn't independently know what a block is.

## Hooks: The Site Calls You Here

JULES: Hooks are named extension points Drupal invokes. A module can react to an event in the application lifecycle or alter data being prepared.

PARISA: That's related to WordPress hooks conceptually, but the APIs and discovery rules differ. Don't paste an add_action call into a Drupal module and hope the CMSes negotiate.

JULES: Historically, many Drupal hooks were procedural functions with a module-name prefix in a dot-module file. You'll absolutely encounter that in real Drupal 10 and 11 projects.

PARISA: The function name is part of the discovery convention. That explains why renaming it to something prettier can stop the behavior without producing an obvious PHP syntax error.

JULES: Modern Drupal 11 supports object-oriented hook implementations using attributes, introduced in 11.1. A class method can declare which hook it implements, and its class can use dependency injection.

PARISA: The motivation is visible dependencies, testable objects, and structured metadata instead of relying only on specially named global functions. It isn't that old PHP functions suddenly stopped being capable of work.

## The Same Hook in Two Forms

JULES: The companion shows a help hook in procedural form and then its object-oriented equivalent. These are alternatives for the demonstration, not instructions to enable two identical implementations together.

[CODE CARD: Procedural alternative; bellweather_tools.module]
```php
<?php

use Drupal\Core\Routing\RouteMatchInterface;

function bellweather_tools_help($route_name, RouteMatchInterface $route_match) {
  if ($route_name === 'help.page.bellweather_tools') {
    return ['#markup' => t('Bellweather Tools provides a demonstration welcome page.')];
  }
  return [];
}
```

[CODE CARD: OOP alternative for Drupal 11.1+; src/Hook/BellweatherHooks.php]
```php
<?php

namespace Drupal\bellweather_tools\Hook;

use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

final class BellweatherHooks {
  use StringTranslationTrait;

  #[Hook('help')]
  public function help(string $route_name, RouteMatchInterface $route_match): array {
    if ($route_name === 'help.page.bellweather_tools') {
      return ['#markup' => $this->t('Bellweather Tools provides a demonstration welcome page.')];
    }
    return [];
  }
}
```

PARISA: The hash-and-brackets notation is PHP attribute syntax. Hook is Drupal's attribute class. The help name identifies the Drupal extension point. The translation trait is reusable PHP code supplied by Drupal.

JULES: And the fixed translated message isn't untrusted input. If we add dynamic values later, use appropriate translation placeholders and output handling.

PARISA: To see the help page, the core Help module needs to be enabled, and the user needs access to the relevant administration page. Rebuild caches after adding the implementation so discovery picks it up.

JULES: For a module supporting older Drupal releases too, there are compatibility patterns involving procedural implementations and LegacyHook. Follow the current documentation for the supported range instead of blindly shipping both versions and invoking behavior twice.

## Procedural Has Not Vanished

PARISA: Which hooks still have to be procedural?

JULES: The current API lists installation and update-related hooks, certain legacy meta hooks, and theme hooks among the exceptions. Database update functions such as hook update N are a key example. We don't convert them merely because we learned attribute syntax.

PARISA: And our theme preprocessing discussion remains valid. Module hook modernization isn't permission to treat every Drupal extension point as interchangeable.

JULES: Exactly. Hook ordering has also evolved, with additional attribute-based controls in newer Drupal 11 minors. If ordering matters, read the API for the installed version rather than relying on accidental discovery order.

PARISA: This is where “modernize everything” can become an expensive bug generator. We modernize with a supported contract and tests, not a search-and-replace operation fueled by vibes.

## Events Are Another Extension Mechanism

JULES: You'll also encounter event subscribers using Symfony's event-dispatcher model. An event object is dispatched, and subscribers registered for it can respond.

PARISA: Similar motivation to hooks: let different pieces participate without hard-coding every participant. But the event names, object types, registration, and lifecycle are different.

JULES: Yes. Use the mechanism the relevant API exposes. Don't invent a universal rule that hooks are obsolete and events replace all of them. Drupal continues to use both.

PARISA: And a service isn't an event subscriber merely because it's a service. Registration or tags connect it to the event system. These nouns describe different roles a class can play.

## Read the Module Like a Map

JULES: When you inherit a module, start with its declared dependencies and routes. Follow a route to its controller. Look at constructor arguments and service definitions. Then inspect relevant plugins and hooks.

PARISA: Ask where the operation begins, what it depends on, who may invoke it, and what it returns. Then check cacheability for output and validation for changes.

JULES: For a state-changing operation, don't copy our read-only welcome route and call it done. You need the appropriate request method, permissions, validation, and CSRF protections for the authentication model. Drupal's Form API handles much of that for ordinary forms.

PARISA: And test behavior, not just whether the class loads. An unauthorized user should be denied. A changed dependency should appear in output. A failed integration should produce a controlled result rather than leaking secrets or crashing the whole page.

## Which Part Was Drupal?

JULES: PHP supplied the language. Symfony supplied important reusable foundations. Drupal supplied the CMS-specific routing integration, entity and rendering systems, services, plugins, and hook contracts. Composer supplied the dependency and autoloading workflow.

PARISA: And our module supplied the university-specific behavior. If we keep those boundaries visible, unfamiliar code stops looking like one enormous Drupal spell.

JULES: Next time we move that code and configuration between environments.

PARISA: Where someone says, “But I changed it in the admin UI.”

JULES: You sound worried.

PARISA: I have deployed websites before.

[OUTRO MUSIC]

## Production References

- Hooks and exceptions, checked September 16, 2026: https://api.drupal.org/api/drupal/core%21lib%21Drupal%21Core%21Hook%21Attribute%21Hook.php/class/Hook/11.x
- Understanding hooks: https://www.drupal.org/docs/develop/creating-modules/understanding-hooks
- Drupal 11.2 hook ordering: https://www.drupal.org/node/3515207
- Services and dependency injection: https://www.drupal.org/docs/drupal-apis/services-and-dependency-injection
- Routing: https://www.drupal.org/docs/drupal-apis/routing-system
- PHP compatibility matrix: https://www.drupal.org/docs/getting-started/system-requirements/php-requirements
- Hook examples are alternatives. This production task did not install Drupal or execute the PHP module.
