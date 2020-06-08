import * as vscode from 'vscode';
import { execFileSync } from "child_process";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("nix", {
      provideDocumentFormattingEdits: (document, _options, _token) => {
        const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
        const config = vscode.workspace.getConfiguration("nixpkgs-fmt");
        try {
          const formattedText = execFileSync(config.path, { input: document.getText() });
          return [vscode.TextEdit.replace(fullRange, formattedText.toString())];
        }
        catch (e) {
          vscode.window.showErrorMessage(`nixpkgs-fmt failed: ${e}`);
        }
        return;
      }
    })
  );
}

export function deactivate() { }
