export enum Status {
    pending = 'pending',
    success = 'success',
    error = 'error'
}

export type WrapResult<Return> = { read: () => Return };

type Options<Return> = {
    headers?: any;
    readModifier?: (json: any) => Return;
}

export function wrapFetch<Return>(uri: string, options?: Options<Return>): WrapResult<Return> {
    let status: Status = Status.pending,
        response: Response | Error | Return;

    const promise: Promise<void> = fetch(uri, { headers: options?.headers })
        .then(r => {
            if (!r.ok)
                throw r;

            return r.json();
        }).then(json => {
            status = Status.success;
            response = json;
        }).catch(e => {
            status = Status.error;
            response = e;
        });

    return {
        read: () => {
            switch (status) {
                case Status.pending:
                    throw promise;
                case Status.error:
                    throw response;
                default:
                    return options?.readModifier ? options.readModifier(response as Response) : response as Return;
            }
        }
    };
}

export function wrap<Return>(func: () => Promise<Return>) {
    let status: Status = Status.pending,
        response: Response | Error | Return;

    const promise: Promise<void> = func().then(result => {
        status = Status.success;
        response = result;
    }).catch(e => {
        status = Status.error;
        response = e;
    });

    return {
        read: () => {
            switch (status) {
                case Status.pending:
                    throw promise;
                case Status.error:
                    throw response;
                default:
                    return response as Return;
            }
        }
    };
}