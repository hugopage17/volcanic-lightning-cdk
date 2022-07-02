import { z, ZodSchema, ZodType } from 'zod';
import { GeoJSON, Feature } from '@global-volcanic-lightning/types';
import lightningPoller from "../api/lightning-poller";


describe('Lightning Poller response', () => {
    it('Response should match the schema', async () => {
        const res = await lightningPoller()
        const featureSchema = z.object<any>({
            type: z.literal('Feature') as any as ZodType<string>,
            geometry: z.object<any>({
                type: z.literal('Point') as any as ZodType<string>,
                coordinates: z.number().array() as any as ZodType<[number, number]>
            }) as any as ZodSchema<Feature['geometry']>,
            properties: z.object<any>({
                name: z.string(),
                area: z.string(),
                twentyKmStrikes: z.number(),
                hundredKmStrikes: z.number(),
                volcanoType: z.string(),
                severity: z.string(),
            }) as any as ZodSchema<Feature['properties']>,
        }) as any as ZodSchema<Feature>

        const schema = z.object<any>({
            type: z.literal('FeatureCollection') as any as ZodType<string>,
            timestamp: z.string(),
            features: featureSchema.array()
        }) as any as ZodSchema<GeoJSON>
        
        const validator = schema.safeParse(res);
        expect(validator.success).toBe(true);
        expect(res.timestamp).toBeDefined()
        if (res.features.length) {
            expect(res.features[0].properties.name).toBeDefined()
        }
    });
});
