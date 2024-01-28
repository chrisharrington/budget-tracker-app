import React, { Suspense } from 'react';

type Props = {
    loadingFallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
} & React.PropsWithChildren;

type State = {
    hasError: boolean;
}

export class LoaderBoundary extends React.Component<Props, State> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('LoaderBoundary caught an error:', error, errorInfo);
        this.props.onError && this.props.onError(error, errorInfo);
    }

    render() {
        return this.state.hasError ? (this.props.errorFallback || <></>) : <Suspense fallback={this.props.loadingFallback || <></>}>
            {this.props.children}
        </Suspense>;
    }
}