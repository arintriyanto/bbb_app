import {Component} from "@angular/core";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {

	/**
	 * Deep linking scheme used to open the BBB app.
	 */
	private static readonly BBB_APP_SCHEME: string = "bbb-app";

	/**
	 * Meeting URL to attend.
	 */
	private _meetingUrl: string | null = null;

	/**
	 * Optional access code of the meeting.
	 */
	private _accessCode: string | null = null;

	constructor(
		private readonly sanitizer: DomSanitizer
	) {
		const urlParams = new URLSearchParams(window.location.search);

		const meetingUrlParam = urlParams.get("target");
		if (!!meetingUrlParam && meetingUrlParam.length > 0) {
			this._meetingUrl = meetingUrlParam;
		}

		const accessCodeParam = urlParams.get("accessCode");
		if (!!accessCodeParam && accessCodeParam.length > 0) {
			this._accessCode = accessCodeParam;
		}
	}

	/**
	 * Whether there is a meeting URl currently specified in the URL.
	 */
	public get hasMeetingUrl(): boolean {
		return !!this._meetingUrl;
	}

	/**
	 * Get the base URL of the application.
	 */
	public get baseUrl(): string {
		const url: Location = window.location;

		return `${url.protocol}//${url.host}/`;
	}

	/**
	 * Get the open in browser link.
	 */
	public get openInBrowserLink(): string {
		return this._meetingUrl;
	}

	/**
	 * Get the open in app link.
	 */
	public get openInAppLink(): SafeUrl {
		const normalizedMeetingURL: string = this._meetingUrl.replace("https://", "");

		return this.sanitizer.bypassSecurityTrustUrl(
			`${AppComponent.BBB_APP_SCHEME}://${normalizedMeetingURL}${!!this._accessCode ? `?accessCode=${this._accessCode}` : ""}`
		);
	}

}
