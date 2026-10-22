import type { ComponentType } from 'react'
import type { LabName } from '@/lib/lessons/labs'
import type { LabProps } from './shared'
import { AccessibilityView } from './accessibility-view'
import { AiOrNot } from './ai-or-not'
import { ApiDocs } from './api-docs'
import { AttackPaths } from './attack-paths'
import { Attackers } from './attackers'
import { BackupPlan } from './backup-plan'
import { BinaryBits } from './binary-bits'
import { BranchGraph } from './branch-graph'
import { CiaTriad } from './cia-triad'
import { ClientServer } from './client-server'
import { CloudCost } from './cloud-cost'
import { CloudStack } from './cloud-stack'
import { CloudWhere } from './cloud-where'
import { ComputerKinds } from './computer-kinds'
import { ComputerParts } from './computer-parts'
import { ComputingTimeline } from './computing-timeline'
import { CpuCores } from './cpu-cores'
import { DataCentre } from './data-centre'
import { DataHome } from './data-home'
import { DataKinds } from './data-kinds'
import { DataSizes } from './data-sizes'
import { DataToInfo } from './data-to-info'
import { DatabaseJobs } from './database-jobs'
import { DeployPipeline } from './deploy-pipeline'
import { DesignFile } from './design-file'
import { DeskSetup } from './desk-setup'
import { DesktopOs } from './desktop-os'
import { DevCycle } from './dev-cycle'
import { DeviceCheck } from './device-check'
import { DevicePicker } from './device-picker'
import { DevTools } from './devtools'
import { DnsLookup } from './dns-lookup'
import { DocFormat } from './doc-format'
import { DomTree } from './dom-tree'
import { DownloadTime } from './download-time'
import { DriveTypes } from './drive-types'
import { EditorTour } from './editor-tour'
import { EmailDraft } from './email-draft'
import { FactCheck } from './fact-check'
import { FileManager } from './file-manager'
import { FilePaths } from './file-paths'
import { FileTypes } from './file-types'
import { FlexAxes } from './flex-axes'
import { Flowchart } from './flowchart'
import { FolderTidy } from './folder-tidy'
import { Footprint } from './footprint'
import { FrontOrBack } from './front-or-back'
import { GitFlow } from './git-flow'
import { HomeNetwork } from './home-network'
import { HttpExchange } from './http-exchange'
import { InsideLaptop } from './inside-laptop'
import { InstallSource } from './install-source'
import { IpAddress } from './ip-address'
import { JsonShape } from './json-shape'
import { Languages } from './languages'
import { LicenceTypes } from './licence-types'
import { Lighthouse } from './lighthouse'
import { LinkPreview } from './link-preview'
import { MalwareKinds } from './malware-kinds'
import { MlTrain } from './ml-train'
import { NetworkFault } from './network-fault'
import { Operators } from './operators'
import { OsLayers } from './os-layers'
import { PacketJourney } from './packet-journey'
import { PageLoad } from './page-load'
import { PasswordStrength } from './password-strength'
import { PatchRace } from './patch-race'
import { PathFinder } from './path-finder'
import { PhishingSpot } from './phishing-spot'
import { PhoneOs } from './phone-os'
import { PortShapes } from './port-shapes'
import { PracticeShell } from './practice-shell'
import { PromptBuilder } from './prompt-builder'
import { PythonRun } from './python-run'
import { QueryOrder } from './query-order'
import { RamApps } from './ram-apps'
import { RequestBuilder } from './request-builder'
import { RequestJourney } from './request-journey'
import { RiskMatrix } from './risk-matrix'
import { RobotSteps } from './robot-steps'
import { ScreenPixels } from './screen-pixels'
import { ScreenReader } from './screen-reader'
import { ShareSettings } from './share-settings'
import { ShopBackend } from './shop-backend'
import { ShortcutKeys } from './shortcut-keys'
import { SignupTable } from './signup-table'
import { SlideMakeover } from './slide-makeover'
import { SmartHome } from './smart-home'
import { SpecSheet } from './spec-sheet'
import { Spreadsheet } from './spreadsheet'
import { StatusCodes } from './status-codes'
import { StringTools } from './string-tools'
import { SyncBackup } from './sync-backup'
import { TableAnatomy } from './table-anatomy'
import { TableQuestion } from './table-question'
import { Terminal } from './terminal'
import { TerminalAnatomy } from './terminal-anatomy'
import { ThreatHouse } from './threat-house'
import { TimeZones } from './time-zones'
import { TracebackParts } from './traceback-parts'
import { TwoFactor } from './two-factor'
import { UrlAnatomy } from './url-anatomy'
import { VariableLabels } from './variable-labels'
import { VersionTimeline } from './version-timeline'
import { WhatYouProtect } from './what-you-protect'
import { WhereFilter } from './where-filter'
import { WifiSignal } from './wifi-signal'
import { XrSpectrum } from './xr-spectrum'

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
  'inside-laptop': InsideLaptop,
  'cpu-cores': CpuCores,
  'ram-apps': RamApps,
  'drive-types': DriveTypes,
  'screen-pixels': ScreenPixels,
  'port-shapes': PortShapes,
  'spec-sheet': SpecSheet,
  'device-picker': DevicePicker,
  'os-layers': OsLayers,
  'desktop-os': DesktopOs,
  'phone-os': PhoneOs,
  'install-source': InstallSource,
  'patch-race': PatchRace,
  'file-types': FileTypes,
  'licence-types': LicenceTypes,
  'folder-tidy': FolderTidy,
  'path-finder': PathFinder,
  'file-manager': FileManager,
  'terminal-anatomy': TerminalAnatomy,
  'practice-shell': PracticeShell,
  'home-network': HomeNetwork,
  'wifi-signal': WifiSignal,
  'ip-address': IpAddress,
  'dns-lookup': DnsLookup,
  'packet-journey': PacketJourney,
  'download-time': DownloadTime,
  'network-fault': NetworkFault,
  'cloud-where': CloudWhere,
  'sync-backup': SyncBackup,
  'cloud-stack': CloudStack,
  'data-centre': DataCentre,
  'cloud-cost': CloudCost,
  'backup-plan': BackupPlan,
  'doc-format': DocFormat,
  spreadsheet: Spreadsheet,
  'slide-makeover': SlideMakeover,
  'email-draft': EmailDraft,
  'time-zones': TimeZones,
  'share-settings': ShareSettings,
  'shortcut-keys': ShortcutKeys,
  'data-to-info': DataToInfo,
  'data-kinds': DataKinds,
  'signup-table': SignupTable,
  'database-jobs': DatabaseJobs,
  'table-question': TableQuestion,
  'dev-cycle': DevCycle,
  'robot-steps': RobotSteps,
  flowchart: Flowchart,
  languages: Languages,
  'version-timeline': VersionTimeline,
  'ai-or-not': AiOrNot,
  'ml-train': MlTrain,
  'prompt-builder': PromptBuilder,
  'fact-check': FactCheck,
  'smart-home': SmartHome,
  'xr-spectrum': XrSpectrum,
  'password-strength': PasswordStrength,
  'two-factor': TwoFactor,
  'phishing-spot': PhishingSpot,
  'malware-kinds': MalwareKinds,
  footprint: Footprint,
  'desk-setup': DeskSetup,
  'accessibility-view': AccessibilityView,
  'what-you-protect': WhatYouProtect,
  'cia-triad': CiaTriad,
  'threat-house': ThreatHouse,
  attackers: Attackers,
  'attack-paths': AttackPaths,
  'risk-matrix': RiskMatrix,
  'shop-backend': ShopBackend,
  'front-or-back': FrontOrBack,
  'client-server': ClientServer,
  'request-builder': RequestBuilder,
  'status-codes': StatusCodes,
  'json-shape': JsonShape,
  'api-docs': ApiDocs,
  'python-run': PythonRun,
  'variable-labels': VariableLabels,
  'operators': Operators,
  'traceback-parts': TracebackParts,
  'string-tools': StringTools,
  'data-home': DataHome,
  'table-anatomy': TableAnatomy,
  'where-filter': WhereFilter,
  'query-order': QueryOrder,
}
