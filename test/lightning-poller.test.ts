import { z, ZodSchema, ZodType } from 'zod';
import { GeoJSON, Feature } from '@global-volcanic-lightning/types';
import lightningPoller from "../api/lightning-poller";


describe('Lightning Poller response', () => {
    it('Response should match the schema', () => {
        lightningPoller().then((res) => {
            const featureSchema: ZodSchema<Feature> = z.object({
                type: z.literal('Feature'),
                geometry: z.object({
                    type: z.literal('Point'),
                    coordinates: z.number().array() as any as ZodType<[number, number]>
                }).required().strict(),
                properties: z.object({
                    number: z.string(),
                    name: z.string(),
                    area: z.string(),
                    twentyKmStrikes: z.number(),
                    hundredKmStrikes: z.number(),
                    volcanoType: z.string(),
                    severity: z.string(),
                }).required().strict()
            }).required().strict()

            const schema: ZodSchema<GeoJSON> = z.object({
                type: z.literal('FeatureCollection'),
                timestamp: z.string(),
                features: z.array(featureSchema)
            }).required().strict()

            const validator = schema.safeParse(res);
            expect(validator.success).toBe(true);
            expect(res.timestamp).toBeDefined()
            if (res.features.length) {
                expect(res.features[0].properties.name).toBeDefined()
            }
        });
    });
});
