// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Module for the skill editor page.
 */

import 'core-js/es7/reflect';
import 'zone.js';

import 'angular-ui-sortable';
import uiValidate from 'angular-ui-validate';
import 'third-party-imports/ng-audio.import';
import 'third-party-imports/ui-codemirror.import';
import 'third-party-imports/ui-tree.import';

angular.module('oppia', [
  require('angular-cookies'), 'headroom', 'ngAnimate',
  'ngAudio', 'ngMaterial', 'ngSanitize', 'ngTouch', 'pascalprecht.translate',
  'toastr', 'ui.bootstrap', 'ui.codemirror', 'ui.sortable', 'ui.tree',
  uiValidate
]);

import { NgModule, StaticProvider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { downgradeComponent } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from 'services/request-interceptor.service';
import { SharedComponentsModule } from 'components/shared-component.module';
import { OppiaAngularRootComponent } from
  'components/oppia-angular-root.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedComponentsModule
  ],
  declarations: [
    OppiaAngularRootComponent
  ],
  entryComponents: [
    OppiaAngularRootComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ]
})
class SkillEditorPageModule {
  // Empty placeholder method to satisfy the `Compiler`.
  ngDoBootstrap() {}
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { downgradeModule } from '@angular/upgrade/static';

const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(SkillEditorPageModule);
};
const downgradedModule = downgradeModule(bootstrapFn);

declare var angular: ng.IAngularStatic;

angular.module('oppia').requires.push(downgradedModule);

angular.module('oppia').directive(
  // This directive is the downgraded version of the Angular component to
  // bootstrap the Angular 8.
  'oppiaAngularRoot',
  downgradeComponent({
    component: OppiaAngularRootComponent
  }) as angular.IDirectiveFactory);
