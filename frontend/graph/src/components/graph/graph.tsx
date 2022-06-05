import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import IEntitiesAndConnectionsResponse from '../../interfaces/response/entities-connections-response.interface';
import GraphModel from '../../models/graph/graph.model';

export default function Graph(): JSX.Element {

    const data = useSelector((state: { entitiesConnections: IEntitiesAndConnectionsResponse }) => {
        return state.entitiesConnections;
    });

    const [graphModel, setGraphModel] = useState<GraphModel | null>(null);

    useEffect(() => {

        const graph = new GraphModel("svg", data);
        graph.addSimulation();
        setGraphModel(graph);
    }, [data]);

    const width = window.innerWidth - 1;
    const height = window.innerHeight - 4;

    return <svg height={height} width={width}></svg>;
}

export {};