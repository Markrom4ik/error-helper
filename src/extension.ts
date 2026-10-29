
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'error-helper.checkCode',
        () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage('Сначала открой файл с кодом.');
                return;
            }

            const code = editor.document.getText(editor.selection);

            if (code.trim() === '') {
                vscode.window.showWarningMessage(
                    'Сначала выдели фрагмент кода.'
                );
                return;
            }

            const problems: string[] = [];
            const lines = code.split('\n');

            let balance = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line === '') {
                    continue;
                }

                for (const symbol of line) {
                    if (symbol === '(' || symbol === '{' || symbol === '[') {
                        balance++;
                    }

                    if (symbol === ')' || symbol === '}' || symbol === ']') {
                        balance--;
                    }
                }

                const needsSemicolon =
                    /^(int|double|float|char|bool|string|return|cout|cin)\b/.test(line);

                if (
                    needsSemicolon &&
                    !line.endsWith(';') &&
                    !line.endsWith('{') &&
                    !line.endsWith(',')
                ) {
                    problems.push(`Строка ${i + 1}: возможно, пропущена точка с запятой.`);
                }
            }

            if (balance !== 0) {
                problems.push('Возможно, не хватает закрывающей скобки или лишняя закрывающая скобка.');
            }

            if (problems.length === 0) {
                vscode.window.showInformationMessage(
                    'Error Helper: явных проблем не обнаружено!'
                );
            } else {
                vscode.window.showWarningMessage(problems.join('\n'));
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
