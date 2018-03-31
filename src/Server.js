'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');

module.exports = class Server {

    constructor ({ config, log }) {

        /**
         * @type {Router}
         */
        this.rootRouter = new KoaRouter();
        this.rootRouter.use(this._getErrorHandler());

        /**
         * @type {Application}
         */
        this.app = new Koa();
        this.app.use(this.rootRouter);

        const port = config.get('SERVER_PORT', 3000);
        app.listen(port, () => {
            log.log(`Server is listening on port ${port}.`);
        });
    }

    rootRouter ({ authorization = false }) {
        const router = new KoaRouter();
        this.rootRouter.use(router);
        return router;
    }

    /**
     * @returns {Function}
     */
    _getErrorHandler () {

        return async function (ctx, next) {

            try {

                await next();

            } catch (originalError) {

                let err = originalError;

                if (!(err instanceof AppError)) {

                    if (err instanceof Error) {

                        err = new AppError(`${err.name}: ${err.message}`, {
                            code: err.status || 500,
                            httpStatus: err.statusCode || 500
                        });

                        err.redirect = err.redirect || null;

                    } else if (typeof err === 'string') {
                        err = new AppError(err, 500, 500);

                    } else {
                        err = new AppError('Unknown error', 500, 500);
                    }

                    err.stack = originalError.stack;
                }

                const metaData = {
                    code: err.code,
                    httpStatus: err.httpStatus || 500,
                    url: ctx.request.originalUrl,
                    query: ctx.request.query,
                    method: ctx.req.method,
                    remoteAddress: ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress
                };

                if (!ctx.request.is('multipart/*')) {
                    metaData.body = ctx.request.body;
                }

                if (ctx.req.headers && ctx.req.headers.referer) {
                    metaData.referer = ctx.req.headers.referer;
                }

                if (err.httpStatus === 500) {
                    metaData.stack = err.stack;
                }

                if (err.redirect) {
                    metaData.redirect = err.redirect;
                }

                if (err.forceLogLevel) {
                    metaData.forceLogLevel = err.forceLogLevel;
                }

                if (err.httpStatus === 404 || err.httpStatus === 401 || err.httpStatus === 429) {
                    console.warn(err.error, metaData); // eslint-disable-line

                } else if (err.httpStatus === 500 || err.httpStatus === 408) {
                    console.error(err.error, metaData); // eslint-disable-line

                } else {
                    metaData.response = err;
                    console.info(err.error, metaData); // eslint-disable-line
                }

                ctx.status = err.httpStatus;
                ctx.body = err;
            }

        };
    }

};
