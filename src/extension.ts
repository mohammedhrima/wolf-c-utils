import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Remove or comment out the autocompletion provider
  /*
  const wolfcCompletionProvider = vscode.languages.registerCompletionItemProvider(
    'wolf-c',
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        const completionItems: vscode.CompletionItem[] = [];
        const keywords = ['int', 'chars', 'char', 'array', 'if', 'else', 'elif', 'while', 'func', 'struct', 'imp', 'return', 'switch', 'case', 'default'];
        for (const keyword of keywords) {
          const completionItem = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
          completionItems.push(completionItem);
        }

        const funcCompletion = new vscode.CompletionItem('func myFunction()', vscode.CompletionItemKind.Function);
        funcCompletion.insertText = new vscode.SnippetString('func ${1:functionName}(${2:params}) {\n\t$3\n}');
        completionItems.push(funcCompletion);

        return completionItems;
      }
    },
    ' ', '\n', '.'
  );

  context.subscriptions.push(wolfcCompletionProvider);
  */

  // Keep other features like formatting and linting
  vscode.languages.registerDocumentFormattingEditProvider('wolf-c', {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      const edits: vscode.TextEdit[] = [];
      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const text = line.text;
        if (text.includes(',')) {
          const formattedText = text.replace(/,(\S)/g, ', $1');
          edits.push(vscode.TextEdit.replace(line.range, formattedText));
        }
      }
      return edits;
    }
  });

  const wolfcDiagnostics = vscode.languages.createDiagnosticCollection('wolf-c');
  context.subscriptions.push(wolfcDiagnostics);

  vscode.workspace.onDidChangeTextDocument(event => {
    if (event.document.languageId !== 'wolf-c') {
      return;
    }
    const diagnostics: vscode.Diagnostic[] = [];
    const text = event.document.getText();
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > 80) {
        const diagnostic = new vscode.Diagnostic(
          new vscode.Range(i, 80, i, lines[i].length),
          'Line exceeds 80 characters',
          vscode.DiagnosticSeverity.Warning
        );
        diagnostics.push(diagnostic);
      }
    }
    wolfcDiagnostics.set(event.document.uri, diagnostics);
  });
}

export function deactivate() {}