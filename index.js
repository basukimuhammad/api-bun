import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { Logestic } from 'logestic';
import staticPlugin from '@elysiajs/static';
import { config } from './src/config';
import { getHealth, getHealthDetail, getStatus, getStatusDetail } from './src/routes/api/information';
import { Mikasa, MikasaDetail, Allyfy, AllyfyDetail } from './src/routes/api/ai';
import { tiktokjs, tiktokjsDetail, ttSave, ttSaveDetail } from './src/routes/api/downloader';
import { hariLibur, hariLiburDetail, weather, weatherDetail } from './src/routes/api/utilities';

const app = new Elysia();
const PORT = config.port;

app.use(cors());
app.use(staticPlugin());
app.use(Logestic.preset('fancy'));

app.get('/', () => ({ status: 'API is running' }));
app.get('/status', getStatus, { ...getStatusDetail });
app.get('/health', getHealth, { ...getHealthDetail });
app.get('/favicon.ico', () => Bun.file('public/favicon.ico'));

app.group('/api', app => app
  .get('/ai/mikasa', async ({ query }) => await Mikasa(query.q), {
    ...MikasaDetail,
    beforeHandle({ set, query }) {
      if (!query?.q) {
        set.status = 400;
        return 'Missing or invalid query parameter, /mikasa?q=foo is required';
      }
    }
  })
  .get('/ai/allyfy', async ({ query }) => await Allyfy(query.q), {
    ...AllyfyDetail,
    beforeHandle({ set, query }) {
      if (!query?.q) {
        set.status = 400;
        return 'Missing or invalid query parameter, /allyfy?q=foo is required';
      }
    }
  })
  .get('/downloader/ttsave', async ({ query }) => await ttSave(query.url), {
    ...ttSaveDetail,
    beforeHandle({ set, query }) {
      if (!query?.url || !URL.canParse(query.url)) {
        set.status = 400;
        return 'Missing or invalid query parameter, /report?url=foo is required';
      }
    }
  })
  .get('/downloader/tiktokjs', async ({ query }) => await tiktokjs(query.url), {
    ...tiktokjsDetail,
    beforeHandle({ set, query }) {
      if (!query?.url || !URL.canParse(query.url)) {
        set.status = 400;
        return 'Missing or invalid query parameter, /report?url=foo is required';
      }
    }
  })
  .get('/utilities/weather', async ({ query }) => await weather(query.kota), {
    ...weatherDetail,
    beforeHandle({ set, query }) {
      if (!query?.kota) {
        set.status = 400;
        return 'Missing query parameter, we need /weather?kota=city';
      }
    }
  })
  .get('/utilities/harilibur', async () => await hariLibur(), {
    ...hariLiburDetail
  })
);

app.use(swagger({
  documentation: {
    info: {
      title: 'Wudysoft API',
      version: '1.0.0',
      description: 'API documentation for the Wudysoft service, providing information on various endpoints, query parameters, and responses.',
    },
    servers: [
      { url: 'https://wudysoft.us.kg', description: 'Local development server' }
    ]
  },
  path: '/docs'
}));

app.listen(PORT);
