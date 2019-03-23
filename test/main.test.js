import assert from 'assert';
import path from 'path';
import AntiCaptcha, { getImageData } from '../build';

const apiKey = process.env.API_KEY || 'test_api_key';

describe('Test Constructor', () => {
    const client = new AntiCaptcha(apiKey);

    it('Construct AntiCaptcha', () => {
        assert.ok(client);
    });

    it('Check Client Key', () => {
        assert.equal(apiKey, client.getApiKey());
    });

    it('Method: getBalance', async () => {
        try {
            const balance = await client.getBalance();
            assert.ok(typeof balance === 'number');
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Method: create', async () => {

        const imgData = getImageData(path.resolve('./test/fixtures/image.jpg'));
        const result = await client.resolveImage(imgData);

        assert.equal('n6m44', result.solution.text);
    }, 30 * 1000);
});
