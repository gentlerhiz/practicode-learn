import type { ComponentType } from 'react'
import type { LabName } from '@/lib/lessons/labs'
import { BranchGraph } from './branch-graph'
import { DevTools } from './devtools'
import { DomTree } from './dom-tree'
import { EditorTour } from './editor-tour'
import { FilePaths } from './file-paths'
import { FlexAxes } from './flex-axes'
import { GitFlow } from './git-flow'
import { HttpExchange } from './http-exchange'
import { LinkPreview } from './link-preview'
import { PageLoad } from './page-load'
import { RequestJourney } from './request-journey'
import { ScreenReader } from './screen-reader'
import type { LabProps } from './shared'
import { Terminal } from './terminal'
import { UrlAnatomy } from './url-anatomy'

/** Every lab a lesson can name. Diagram labs take a `state`; Explore labs take the control's `value`. */
export const labs: Record<LabName, ComponentType<LabProps>> = {
  'request-journey': RequestJourney,
  'page-load': PageLoad,
  'flex-axes': FlexAxes,
  'url-anatomy': UrlAnatomy,
  'http-exchange': HttpExchange,
  'file-paths': FilePaths,
  'screen-reader': ScreenReader,
  'link-preview': LinkPreview,
  'editor-tour': EditorTour,
  terminal: Terminal,
  'git-flow': GitFlow,
  devtools: DevTools,
  'dom-tree': DomTree,
  'branch-graph': BranchGraph,
}
