import axios from 'axios';
import { GeoJSON } from '@global-volcanic-lightning/types';

const lightningPoller = async (): Promise<GeoJSON> => {
    const call = await axios.get('https://wwlln.net/USGS/Global/')
    const data = await call.data;

    const timestamp = data.split('\n').find((i: string) => i.includes('Start:')).split('<br />')[0];

    const tableRow = data.split('</tr>')

    const features = tableRow.map((row: string) => {
        const columns = row.split('\n')
        const header = columns.find((i) => i.includes('<tr')) as string
        if (header) {
            const properties = columns.filter((i) => i.includes('<td'))
            const alertRow = header.includes('alert') || header.includes('inner')
            let obj: any = {
                type: "Feature",
                properties: {},
                geometry: {
                    type: 'Point'
                }
            }
            if (alertRow) {
                properties.forEach((tag, index) => {
                    const entry = tag.replace('<td>', '').replace('</td>', '');
                    obj['properties']['severity'] = header.includes('alert') ? 'error' : 'warning';
                    if (index === 1) {
                        obj['properties']['name'] = entry
                    } else if (index === 2) {
                        obj['properties']['area'] = entry
                    } else if (index === 3) {
                        obj['properties']['volcanoType'] = entry
                    } else if (index === 4) {
                        obj['geometry']['coordinates'] = [Number(entry)]
                    } else if (index === 5) {
                        obj['geometry']['coordinates'] = [...obj.geometry.coordinates, Number(entry)]
                    } else if (index === 6) {
                        obj['properties']['twentyKmStrikes'] = Number(entry)
                    } else if (index === 7) {
                        obj['properties']['hundredKmStrikes'] = Number(entry)
                    }
                })
                return obj
            }
        }
    }).filter(Boolean).flat();
    return {
        type: 'FeatureCollection',
        features,
        timestamp: new Date(timestamp).toISOString()
    }
}

export default lightningPoller;
