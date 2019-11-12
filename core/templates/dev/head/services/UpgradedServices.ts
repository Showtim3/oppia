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
 * @fileoverview Service for storing all upgraded services
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { AlertsService } from 'services/alerts.service';
import { BackgroundMaskService } from
  'services/stateful/background-mask.service';
import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { ContextService } from 'services/context.service';
import { ComputeGraphService } from 'services/compute-graph.service';
import { DateTimeFormatService } from 'services/date-time-format.service';
import { DebouncerService } from 'services/debouncer.service';
import { DeviceInfoService } from 'services/contextual/device-info.service';
import { DocumentAttributeCustomizationService } from
  'services/contextual/document-attribute-customization.service';
import { ExtensionTagAssemblerService }
  from 'services/extension-tag-assembler.service';
import { FormatTimePipe } from 'filters/format-timer.pipe';
import { GenerateContentIdService } from 'services/generate-content-id.service';
import { HtmlEscaperService } from 'services/html-escaper.service';
import { LoggerService } from 'services/contextual/logger.service';
import { MetaTagCustomizationService } from
  'services/contextual/meta-tag-customization.service';
import { SidebarStatusService } from 'domain/sidebar/sidebar-status.service';
import { UrlService } from 'services/contextual/url.service';
import { UrlInterpolationService } from
  'domain/utilities/url-interpolation.service';
import { UtilsService } from 'services/utils.service';
import { WindowDimensionsService } from
  'services/contextual/window-dimensions.service';
import { WindowRef } from 'services/contextual/window-ref.service';
import { BaseUndoRedoService } from
  'domain/editor/undo_redo/base-undo-redo.service';
import {UndoRedoService} from 'domain/editor/undo_redo/undo-redo.service';
import {EventService} from 'services/event-service';
import {AdminDataService} from 'pages/admin-page/services/admin-data.service';
import {HttpClient, HttpEvent, HttpHandler, HttpRequest} from
  '@angular/common/http';
import {Observable} from 'rxjs';
import {TranslateTextService} from
  'pages/community-dashboard-page/services/translate-text.service';
import {LocalStorageService} from 'services/local-storage.service';
import {ExplorationDraftObjectFactory} from
  'domain/exploration/ExplorationDraftObjectFactory';
import {CsrfTokenService} from 'services/csrf-token.service';
import {QuestionUndoRedoService} from '../domain/editor/undo_redo/question-undo-redo.service';
import {StopwatchObjectFactory} from '../domain/utilities/StopwatchObjectFactory';
import {ContributionAndReviewServices} from '../pages/community-dashboard-page/services/contribution-and-review.services';
import {ContributionOpportunitiesBackendApiService} from '../pages/community-dashboard-page/services/contribution-opportunities-backend-api.service';
import {ContributionOpportunitiesService} from '../pages/community-dashboard-page/services/contribution-opportunities.service';
import {AssetsBackendApiService} from "./assets-backend-api.service";

@Injectable({
  providedIn: 'root'
})
export class UpgradedServices {
  /* eslint-disable quote-props */
  upgradedServices = {
    'AlertsService': new AlertsService(new LoggerService()),
    'BackgroundMaskService': new BackgroundMaskService(),
    'ComputeGraphService': new ComputeGraphService(),
    'ContextService': new ContextService(new UrlService(new WindowRef())),
    'DateTimeFormatService': new DateTimeFormatService(new FormatTimePipe()),
    'DebouncerService': new DebouncerService(),
    'DeviceInfoService': new DeviceInfoService(new WindowRef()),
    'DocumentAttributeCustomizationService':
        new DocumentAttributeCustomizationService(new WindowRef()),
    'ExtensionTagAssemblerService': new ExtensionTagAssemblerService(
      new HtmlEscaperService(new LoggerService()),
      new CamelCaseToHyphensPipe()),
    'GenerateContentIdService': new GenerateContentIdService(),
    'HtmlEscaperService': new HtmlEscaperService(
      new LoggerService()),
    'MetaTagCustomizationService': new MetaTagCustomizationService(
      new WindowRef()),
    'SidebarStatusService': new SidebarStatusService(
      new WindowDimensionsService()),
    'UrlService': new UrlService(new WindowRef()),
    'UrlInterpolationService': new UrlInterpolationService(new AlertsService(
      new LoggerService()), new UrlService(
      new WindowRef()), new UtilsService()),
    'UtilsService': new UtilsService(),
    'WindowDimensionsService': new WindowDimensionsService(),
    'BaseUndoRedoService': new BaseUndoRedoService(new EventService()),
    'UndoRedoService': new UndoRedoService(new EventService()),
    'AdminDataService': new AdminDataService(
      new HttpClient(<HttpHandler> new class extends HttpHandler {
        handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
          return undefined;
        }
      })),
    'TranslateTextService': new TranslateTextService(
      new HttpClient(new class extends HttpHandler {
        handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
          return undefined;
        }
      })),
    'LocalStorageService': new LocalStorageService(
      new ExplorationDraftObjectFactory()),
    'CsrfTokenService': new CsrfTokenService(),
    'QuestionUndoRedoService': new QuestionUndoRedoService(new EventService()),
    'StopwatchObjectFactory': new StopwatchObjectFactory(),
    'ContributionAndReviewServices': new ContributionAndReviewServices(
      new UrlInterpolationService(new AlertsService(
        new LoggerService()), new UrlService(
        new WindowRef()), new UtilsService()), new HttpClient(
        new class extends HttpHandler {
          handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
            return undefined;
          }
        })),
    'ContributionOpportunitiesBackendApiService':
        new ContributionOpportunitiesBackendApiService(
          new HttpClient(new class extends HttpHandler {
            handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
              return undefined;
            }
          }), new UrlInterpolationService(new AlertsService(
            new LoggerService()), new UrlService(
            new WindowRef()), new UtilsService()) ),
    'ContributionOpportunitiesService': new ContributionOpportunitiesService(
      new ContributionOpportunitiesBackendApiService(
        new HttpClient(new class extends HttpHandler {
          handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
            return undefined;
          }
        }), new UrlInterpolationService(new AlertsService(
          new LoggerService()), new UrlService(
          new WindowRef()), new UtilsService()) )),
  };
}

angular.module('oppia').factory(
  'UpgradedServices',
  downgradeInjectable(UpgradedServices));
