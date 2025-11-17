import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("alert-info")
export class AlertInfo extends LitElement {
    static styles = css`
        div {
            padding: 4px 8px;
        }

        .danger {
            background-color: rgba(248, 113, 113, 0.2);
            border-left: 4px solid #f87171;
        }

        .warning {
            background-color: rgba(250, 204, 21, 0.2);
            border-left: 4px solid #facc15;
        }

        .info {
            background-color: #323c4b;
            border-left: 4px solid #00aafc;
        }

        .success {
            background-color: rgba(52, 211, 153, 0.2);
            border-left: 4px solid #34d399;
        }
    `;

    @property()
    type?: string;

    render() {
        return html`
            <div class="${this.type}">
                <slot></slot>
            </div>
        `;
    }
}
