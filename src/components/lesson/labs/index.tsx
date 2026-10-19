import type { ComponentType } from 'react'
import type { LabName } from '@/lib/lessons/labs'
import { AttackPaths } from './attack-paths'
import { Attackers } from './attackers'
import { BinaryBits } from './binary-bits'
import { BranchGraph } from './branch-graph'
import { CiaTriad } from './cia-triad'
import { ComputerKinds } from './computer-kinds'
import { ComputerParts } from './computer-parts'
import { ComputingTimeline } from './computing-timeline'
import { DataSizes } from './data-sizes'
import { DeployPipeline } from './deploy-pipeline'
import { DesignFile } from './design-file'
import { DeviceCheck } from './device-check'
import { DevTools } from './devtools'
import { DomTree } from './dom-tree'
import { EditorTour } from './editor-tour'
import { FilePaths } from './file-paths'
import { FlexAxes } from './flex-axes'
import { GitFlow } from './git-flow'
import { HttpExchange } from './http-exchange'
import { Lighthouse } from './lighthouse'
import { LinkPreview } from './link-preview'
import { PageLoad } from './page-load'
import { RequestJourney } from './request-journey'
import { RiskMatrix } from './risk-matrix'
import { ScreenReader } from './screen-reader'
import type { LabProps } from './shared'
import { Terminal } from './terminal'
import { ThreatHouse } from './threat-house'
import { UrlAnatomy } from './url-anatomy'
import { WhatYouProtect } from './what-you-protect'

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
  'design-file': DesignFile,
  lighthouse: Lighthouse,
  'deploy-pipeline': DeployPipeline,
  'device-check': DeviceCheck,
  'computer-parts': ComputerParts,
  'computer-kinds': ComputerKinds,
  'computing-timeline': ComputingTimeline,
  'binary-bits': BinaryBits,
  'data-sizes': DataSizes,
  'what-you-protect': WhatYouProtect,
  'cia-triad': CiaTriad,
  'threat-house': ThreatHouse,
  attackers: Attackers,
  'attack-paths': AttackPaths,
  'risk-matrix': RiskMatrix,
}
