import lightningPoller from "../api/lightning-poller";

describe('Lightning Poller response', () => {
    test('Lightning Poller', () => {
        lightningPoller().then(({ features, timestamp }) => {
            expect(timestamp).toBeDefined()
            if (features.length) {
                expect(features[0].properties.name).toBeDefined()
            }
        });
    });
});

