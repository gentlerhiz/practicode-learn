import type { ComponentType } from 'react'
import type { LabName } from '@/lib/lessons/labs'
import { FlexAxes } from './flex-axes'
import { HttpExchange } from './http-exchange'
import { PageLoad } from './page-load'
import { RequestJourney } from './request-journey'
import type { LabProps } from './shared'
import { UrlAnatomy } from './url-anatomy'

/** Every lab a lesson can name. Diagram labs take a `state`; Explore labs take the control's `value`. */
export const labs: Record<LabName, ComponentType<LabProps>> = {
  'request-journey': RequestJourney,
  'page-load': PageLoad,
  'flex-axes': FlexAxes,
  'url-anatomy': UrlAnatomy,
  'http-exchange': HttpExchange,
}
