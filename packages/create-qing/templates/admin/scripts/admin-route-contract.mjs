import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import ts from 'typescript'

async function listTypeScriptFiles(root) {
  const entries = await readdir(root, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(root, entry.name)
      if (entry.isDirectory()) return listTypeScriptFiles(path)
      return entry.isFile() && /\.tsx?$/u.test(entry.name) ? [path] : []
    }),
  )
  return nested.flat()
}

function propertyName(node) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : undefined
}

function objectProperty(object, name) {
  return object.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  )
}

function stringInitializer(property) {
  if (!property || !ts.isPropertyAssignment(property)) return undefined
  return ts.isStringLiteral(property.initializer) ? property.initializer.text : undefined
}

function callStringArgument(sourceFile, callName) {
  let value
  function visit(node) {
    if (
      value === undefined &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === callName &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      value = node.arguments[0].text
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return value
}

function parseSource(file, source) {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

export async function readFeaturePaths(featuresRoot) {
  const featureFiles = (await listTypeScriptFiles(featuresRoot)).filter((file) =>
    file.endsWith('/feature.ts'),
  )
  return Promise.all(
    featureFiles.map(async (file) => {
      const sourceFile = parseSource(file, await readFile(file, 'utf8'))
      let group
      let path
      function visit(node) {
        if (
          path === undefined &&
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'defineAdminFeature' &&
          ts.isObjectLiteralExpression(node.arguments[0])
        ) {
          path = stringInitializer(objectProperty(node.arguments[0], 'path'))
          group = stringInitializer(objectProperty(node.arguments[0], 'group'))
          return
        }
        ts.forEachChild(node, visit)
      }
      visit(sourceFile)
      if (!path || !group) throw new Error(`Feature manifest has no literal path/group: ${file}`)
      return { file, group, path }
    }),
  )
}

/** Read the two executable showcase entry arrays without loading browser-only TSX in Node. */
export async function readShowcasePaths(catalogFile) {
  const sourceFile = parseSource(catalogFile, await readFile(catalogFile, 'utf8'))
  const groups = new Map([
    ['demoEntries', 'demos'],
    ['exampleEntries', 'examples'],
  ])
  const entries = []

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue
      const group = groups.get(declaration.name.text)
      if (
        !group ||
        !declaration.initializer ||
        !ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        continue
      }
      for (const element of declaration.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) {
          throw new Error(`Showcase entry must be an object literal: ${catalogFile}`)
        }
        const path = stringInitializer(objectProperty(element, 'path'))
        if (!path) throw new Error(`Showcase entry has no literal path: ${catalogFile}`)
        entries.push({ group, path })
      }
    }
  }

  if (entries.length === 0) throw new Error(`No showcase entries found: ${catalogFile}`)
  return entries
}

export async function readAdminRouteContracts(routesRoot) {
  const routeFiles = await listTypeScriptFiles(routesRoot)
  const contracts = await Promise.all(
    routeFiles.map(async (file) => {
      const source = await readFile(file, 'utf8')
      const sourceFile = parseSource(file, source)
      const routeId = callStringArgument(sourceFile, 'createFileRoute')
      const guardPath = callStringArgument(sourceFile, 'beforeLoadAdminPage')
      let adminPagePath

      function visit(node) {
        if (
          adminPagePath === undefined &&
          ts.isPropertyAssignment(node) &&
          propertyName(node.name) === 'staticData' &&
          ts.isObjectLiteralExpression(node.initializer)
        ) {
          adminPagePath = stringInitializer(objectProperty(node.initializer, 'adminPagePath'))
          return
        }
        ts.forEachChild(node, visit)
      }
      visit(sourceFile)
      return adminPagePath ? { adminPagePath, file, guardPath, routeId, source } : undefined
    }),
  )
  return contracts.filter((contract) => contract !== undefined)
}
