import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';

@customElement('alert-info')
export class AlertInfo extends LitElement {
    static styles = css`
        div {
            padding: 2px 8px;
        }

        .danger {
            background-color: rgba(248, 113, 113, 0.2);
            border-left: 4px solid #F87171;
        }

        .warning {
            background-color: rgba(250, 204, 21, 0.2);
            border-left: 4px solid #FACC15;
        }

        .info {
            background-color: rgba(96, 165, 250, 0.2);
            border-left: 4px solid #60A5FA;
        }

        .success {
            background-color: rgba(52, 211, 153, 0.2);
            border-left: 4px solid #34D399;
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
