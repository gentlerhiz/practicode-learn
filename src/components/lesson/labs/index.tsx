import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { LabName } from '@/lib/lessons/labs'
import type { LabProps } from './shared'

// Each lab is its own chunk, loaded when a step shows it, so a lesson only downloads the labs it uses.
const AccessibilityView = dynamic(() => import('./accessibility-view').then((m) => m.AccessibilityView))
const AiOrNot = dynamic(() => import('./ai-or-not').then((m) => m.AiOrNot))
const ApiDocs = dynamic(() => import('./api-docs').then((m) => m.ApiDocs))
const ArrayMethods = dynamic(() => import('./array-methods').then((m) => m.ArrayMethods))
const AsyncTimeline = dynamic(() => import('./async-timeline').then((m) => m.AsyncTimeline))
const AttackPaths = dynamic(() => import('./attack-paths').then((m) => m.AttackPaths))
const Attackers = dynamic(() => import('./attackers').then((m) => m.Attackers))
const BackupPlan = dynamic(() => import('./backup-plan').then((m) => m.BackupPlan))
const BinaryBits = dynamic(() => import('./binary-bits').then((m) => m.BinaryBits))
const BranchGraph = dynamic(() => import('./branch-graph').then((m) => m.BranchGraph))
const CallTrace = dynamic(() => import('./call-trace').then((m) => m.CallTrace))
const CiaTriad = dynamic(() => import('./cia-triad').then((m) => m.CiaTriad))
const ClientServer = dynamic(() => import('./client-server').then((m) => m.ClientServer))
const CloudCost = dynamic(() => import('./cloud-cost').then((m) => m.CloudCost))
const CloudStack = dynamic(() => import('./cloud-stack').then((m) => m.CloudStack))
const CloudWhere = dynamic(() => import('./cloud-where').then((m) => m.CloudWhere))
const ComputerKinds = dynamic(() => import('./computer-kinds').then((m) => m.ComputerKinds))
const ComputerParts = dynamic(() => import('./computer-parts').then((m) => m.ComputerParts))
const ComputingTimeline = dynamic(() => import('./computing-timeline').then((m) => m.ComputingTimeline))
const CpuCores = dynamic(() => import('./cpu-cores').then((m) => m.CpuCores))
const DataCentre = dynamic(() => import('./data-centre').then((m) => m.DataCentre))
const DataHome = dynamic(() => import('./data-home').then((m) => m.DataHome))
const DataKinds = dynamic(() => import('./data-kinds').then((m) => m.DataKinds))
const DataSizes = dynamic(() => import('./data-sizes').then((m) => m.DataSizes))
const DataToInfo = dynamic(() => import('./data-to-info').then((m) => m.DataToInfo))
const DatabaseJobs = dynamic(() => import('./database-jobs').then((m) => m.DatabaseJobs))
const DayInRole = dynamic(() => import('./day-in-role').then((m) => m.DayInRole))
const DeployPipeline = dynamic(() => import('./deploy-pipeline').then((m) => m.DeployPipeline))
const DesignFile = dynamic(() => import('./design-file').then((m) => m.DesignFile))
const DeskSetup = dynamic(() => import('./desk-setup').then((m) => m.DeskSetup))
const DesktopOs = dynamic(() => import('./desktop-os').then((m) => m.DesktopOs))
const DevCycle = dynamic(() => import('./dev-cycle').then((m) => m.DevCycle))
const DevTerminal = dynamic(() => import('./dev-terminal').then((m) => m.DevTerminal))
const DevTools = dynamic(() => import('./devtools').then((m) => m.DevTools))
const DeviceCheck = dynamic(() => import('./device-check').then((m) => m.DeviceCheck))
const DevicePicker = dynamic(() => import('./device-picker').then((m) => m.DevicePicker))
const DnsLookup = dynamic(() => import('./dns-lookup').then((m) => m.DnsLookup))
const DocFormat = dynamic(() => import('./doc-format').then((m) => m.DocFormat))
const DomTree = dynamic(() => import('./dom-tree').then((m) => m.DomTree))
const DownloadTime = dynamic(() => import('./download-time').then((m) => m.DownloadTime))
const DriveTypes = dynamic(() => import('./drive-types').then((m) => m.DriveTypes))
const EditorTour = dynamic(() => import('./editor-tour').then((m) => m.EditorTour))
const EmailDraft = dynamic(() => import('./email-draft').then((m) => m.EmailDraft))
const FactCheck = dynamic(() => import('./fact-check').then((m) => m.FactCheck))
const FileManager = dynamic(() => import('./file-manager').then((m) => m.FileManager))
const FilePaths = dynamic(() => import('./file-paths').then((m) => m.FilePaths))
const FileTypes = dynamic(() => import('./file-types').then((m) => m.FileTypes))
const FixFinder = dynamic(() => import('./fix-finder').then((m) => m.FixFinder))
const FlexAxes = dynamic(() => import('./flex-axes').then((m) => m.FlexAxes))
const Flowchart = dynamic(() => import('./flowchart').then((m) => m.Flowchart))
const FolderTidy = dynamic(() => import('./folder-tidy').then((m) => m.FolderTidy))
const Footprint = dynamic(() => import('./footprint').then((m) => m.Footprint))
const FrontOrBack = dynamic(() => import('./front-or-back').then((m) => m.FrontOrBack))
const GitFlow = dynamic(() => import('./git-flow').then((m) => m.GitFlow))
const HomeNetwork = dynamic(() => import('./home-network').then((m) => m.HomeNetwork))
const HttpExchange = dynamic(() => import('./http-exchange').then((m) => m.HttpExchange))
const IfFlow = dynamic(() => import('./if-flow').then((m) => m.IfFlow))
const InsideLaptop = dynamic(() => import('./inside-laptop').then((m) => m.InsideLaptop))
const InstallSource = dynamic(() => import('./install-source').then((m) => m.InstallSource))
const InterestMatch = dynamic(() => import('./interest-match').then((m) => m.InterestMatch))
const IpAddress = dynamic(() => import('./ip-address').then((m) => m.IpAddress))
const JsErrorParts = dynamic(() => import('./js-error-parts').then((m) => m.JsErrorParts))
const JsTypes = dynamic(() => import('./js-types').then((m) => m.JsTypes))
const JsonConvert = dynamic(() => import('./json-convert').then((m) => m.JsonConvert))
const JsonShape = dynamic(() => import('./json-shape').then((m) => m.JsonShape))
const Languages = dynamic(() => import('./languages').then((m) => m.Languages))
const LicenceTypes = dynamic(() => import('./licence-types').then((m) => m.LicenceTypes))
const Lighthouse = dynamic(() => import('./lighthouse').then((m) => m.Lighthouse))
const LinkPreview = dynamic(() => import('./link-preview').then((m) => m.LinkPreview))
const LoopTrace = dynamic(() => import('./loop-trace').then((m) => m.LoopTrace))
const MalwareKinds = dynamic(() => import('./malware-kinds').then((m) => m.MalwareKinds))
const MlTrain = dynamic(() => import('./ml-train').then((m) => m.MlTrain))
const ModuleGraph = dynamic(() => import('./module-graph').then((m) => m.ModuleGraph))
const NetworkFault = dynamic(() => import('./network-fault').then((m) => m.NetworkFault))
const ObjectAccess = dynamic(() => import('./object-access').then((m) => m.ObjectAccess))
const Operators = dynamic(() => import('./operators').then((m) => m.Operators))
const OsLayers = dynamic(() => import('./os-layers').then((m) => m.OsLayers))
const PacketJourney = dynamic(() => import('./packet-journey').then((m) => m.PacketJourney))
const PageLoad = dynamic(() => import('./page-load').then((m) => m.PageLoad))
const PasswordStrength = dynamic(() => import('./password-strength').then((m) => m.PasswordStrength))
const PatchRace = dynamic(() => import('./patch-race').then((m) => m.PatchRace))
const PathFinder = dynamic(() => import('./path-finder').then((m) => m.PathFinder))
const PhishingSpot = dynamic(() => import('./phishing-spot').then((m) => m.PhishingSpot))
const PhoneOs = dynamic(() => import('./phone-os').then((m) => m.PhoneOs))
const PortShapes = dynamic(() => import('./port-shapes').then((m) => m.PortShapes))
const PracticeShell = dynamic(() => import('./practice-shell').then((m) => m.PracticeShell))
const PromptBuilder = dynamic(() => import('./prompt-builder').then((m) => m.PromptBuilder))
const PullRequest = dynamic(() => import('./pull-request').then((m) => m.PullRequest))
const PythonRun = dynamic(() => import('./python-run').then((m) => m.PythonRun))
const QueryOrder = dynamic(() => import('./query-order').then((m) => m.QueryOrder))
const RamApps = dynamic(() => import('./ram-apps').then((m) => m.RamApps))
const RequestBuilder = dynamic(() => import('./request-builder').then((m) => m.RequestBuilder))
const RequestJourney = dynamic(() => import('./request-journey').then((m) => m.RequestJourney))
const RiskMatrix = dynamic(() => import('./risk-matrix').then((m) => m.RiskMatrix))
const RobotSteps = dynamic(() => import('./robot-steps').then((m) => m.RobotSteps))
const RoleMap = dynamic(() => import('./role-map').then((m) => m.RoleMap))
const ScreenPixels = dynamic(() => import('./screen-pixels').then((m) => m.ScreenPixels))
const ScreenReader = dynamic(() => import('./screen-reader').then((m) => m.ScreenReader))
const SearchQuery = dynamic(() => import('./search-query').then((m) => m.SearchQuery))
const ShareSettings = dynamic(() => import('./share-settings').then((m) => m.ShareSettings))
const ShopBackend = dynamic(() => import('./shop-backend').then((m) => m.ShopBackend))
const ShortcutKeys = dynamic(() => import('./shortcut-keys').then((m) => m.ShortcutKeys))
const SignupTable = dynamic(() => import('./signup-table').then((m) => m.SignupTable))
const SlideMakeover = dynamic(() => import('./slide-makeover').then((m) => m.SlideMakeover))
const SmartHome = dynamic(() => import('./smart-home').then((m) => m.SmartHome))
const SpecSheet = dynamic(() => import('./spec-sheet').then((m) => m.SpecSheet))
const Spreadsheet = dynamic(() => import('./spreadsheet').then((m) => m.Spreadsheet))
const StatusCodes = dynamic(() => import('./status-codes').then((m) => m.StatusCodes))
const StringTools = dynamic(() => import('./string-tools').then((m) => m.StringTools))
const SupportTicket = dynamic(() => import('./support-ticket').then((m) => m.SupportTicket))
const SyncBackup = dynamic(() => import('./sync-backup').then((m) => m.SyncBackup))
const TableAnatomy = dynamic(() => import('./table-anatomy').then((m) => m.TableAnatomy))
const TableQuestion = dynamic(() => import('./table-question').then((m) => m.TableQuestion))
const Terminal = dynamic(() => import('./terminal').then((m) => m.Terminal))
const TerminalAnatomy = dynamic(() => import('./terminal-anatomy').then((m) => m.TerminalAnatomy))
const ThreatHouse = dynamic(() => import('./threat-house').then((m) => m.ThreatHouse))
const TicketLife = dynamic(() => import('./ticket-life').then((m) => m.TicketLife))
const TimeZones = dynamic(() => import('./time-zones').then((m) => m.TimeZones))
const TracebackParts = dynamic(() => import('./traceback-parts').then((m) => m.TracebackParts))
const TroubleMethod = dynamic(() => import('./trouble-method').then((m) => m.TroubleMethod))
const TwoFactor = dynamic(() => import('./two-factor').then((m) => m.TwoFactor))
const UrlAnatomy = dynamic(() => import('./url-anatomy').then((m) => m.UrlAnatomy))
const VariableLabels = dynamic(() => import('./variable-labels').then((m) => m.VariableLabels))
const VersionChaos = dynamic(() => import('./version-chaos').then((m) => m.VersionChaos))
const VersionTimeline = dynamic(() => import('./version-timeline').then((m) => m.VersionTimeline))
const WhatYouProtect = dynamic(() => import('./what-you-protect').then((m) => m.WhatYouProtect))
const WhereFilter = dynamic(() => import('./where-filter').then((m) => m.WhereFilter))
const WhyRestart = dynamic(() => import('./why-restart').then((m) => m.WhyRestart))
const WifiSignal = dynamic(() => import('./wifi-signal').then((m) => m.WifiSignal))
const XrSpectrum = dynamic(() => import('./xr-spectrum').then((m) => m.XrSpectrum))

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
  'trouble-method': TroubleMethod,
  'why-restart': WhyRestart,
  'fix-finder': FixFinder,
  'search-query': SearchQuery,
  'support-ticket': SupportTicket,
  'ticket-life': TicketLife,
  'role-map': RoleMap,
  'day-in-role': DayInRole,
  'interest-match': InterestMatch,
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
  'js-types': JsTypes,
  'if-flow': IfFlow,
  'call-trace': CallTrace,
  'loop-trace': LoopTrace,
  'object-access': ObjectAccess,
  'js-error-parts': JsErrorParts,
  'array-methods': ArrayMethods,
  'module-graph': ModuleGraph,
  'async-timeline': AsyncTimeline,
  'json-convert': JsonConvert,
  'dev-terminal': DevTerminal,
  'version-chaos': VersionChaos,
  'pull-request': PullRequest,
}
