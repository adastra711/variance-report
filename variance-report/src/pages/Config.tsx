import { useEffect } from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

const Config = () => {
    useEffect(() => {
        // Initialize the Microsoft Teams SDK
        microsoftTeams.app.initialize().then(() => {
            // Register on save handler
            microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
                microsoftTeams.pages.config.setConfig({
                    suggestedDisplayName: "Variance Report",
                    entityId: "VarianceReport",
                    contentUrl: window.location.origin,
                    websiteUrl: window.location.origin,
                }).then(() => {
                    saveEvent.notifySuccess();
                });
            });

            // Enable the save button
            microsoftTeams.pages.config.setValidityState(true);
        });
    }, []);

    return (
        <div style={{ margin: '20px' }}>
            <h2>Variance Report Configuration</h2>
            <p>Click Save to add this app to your Teams workspace.</p>
        </div>
    );
};

export default Config; 