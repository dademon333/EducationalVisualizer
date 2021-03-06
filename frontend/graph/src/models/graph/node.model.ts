import * as d3 from 'd3'
import SetType from '../../enums/set-type.enum';
import INode from '../../interfaces/graph/node.interface';
import { IFilterState, IVisibleEntity } from '../../redux/slices/filter.slice';
import store from '../../redux/store';
import { getEntityColor } from '../../services/entity.serivce';
import { setVisibleNodes, visibleNodesChanged } from '../../services/event.service';

class NodeModel {

    public node: d3.Selection<SVGGElement, INode, SVGGElement, unknown>;
    public circle: d3.Selection<SVGCircleElement, INode, SVGGElement, unknown>;
    public text: d3.Selection<SVGTextElement, INode, SVGGElement, unknown>;

    constructor(svgElementName: string, nodes: INode[]) {
        const svg = d3.select<SVGElement, any>(svgElementName);

        svg
        .select(".nodes")
        .remove();

        this.node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", d => d.id)
        .attr("name", d => d.name)
        .attr('opacity', 0);
        store.subscribe(() => {
            const state = store.getState();
            state.filters.components.setType === SetType.Union || state.filters.components.entities.length === 1 
            ? this.handleUnionSetType(state)
            : this.handleIntersectionSetType(state);

            visibleNodesChanged();
        });

        this.circle = this.appendCircle();

        this.text = this.appendText();
    }

    private appendCircle(): d3.Selection<SVGCircleElement, INode, SVGGElement, unknown> {
        return this.node
        .append("circle")
        // .on('mouseover', e => {
        //     const data = e.target.__data__;
        //     const connectedNotes = data.connectedNodes;
        //     this.node
        //     .filter(node => !connectedNotes.some((connectedNote: any) => connectedNote.id === node.id) && node.id !== data.id)
        //     .attr('opacity', 0.25);
        // })
        // .on('mouseleave', e => {
        //     const target = e.target;
        //     //console.log(target.__data__);
        //     this.node.attr('opacity', 1);
        // })
        .attr("r", (d) => 15 + d.radius / 5)
        .attr("fill", d => getEntityColor(d.type))
        
        .style("stroke-width", d => 0);
    }

    private appendText(): d3.Selection<SVGTextElement, INode, SVGGElement, unknown> {
        return this.node
        .append("text")
        .attr("font-size", d => d.radius / 25 + 40)
        .attr("dx", 20)
        .attr("dy", "0.5em")
        .text(d => d.text.length > 20 ? d.text.slice(0, 20) + '...' : d.text);
    }

    private handleUnionSetType(state: {filters: IFilterState}) {
        const entitesToShow = state.filters.components.entities;

        if (entitesToShow.length === 0) {
            this.node.attr('opacity', 0);
            return;
        }

        let visibleNodes: INode[] = [];
        
        this.node.filter(el => !entitesToShow.includes(el.id)).attr('opacity', 0);
        this.node.filter(el => {
            const res = entitesToShow.includes(el.id);
            if (res) {
                visibleNodes.push(el);
                visibleNodes.push(...el.children);
            }
            return res;
        });

        console.log(visibleNodes);

        this.node
        .filter(el => visibleNodes.some(node => node.id === el.id))
        .attr('opacity', 1);

        setVisibleNodes(visibleNodes);
    }

    private handleIntersectionSetType(state: {filters: IFilterState}) {
        const entitesToShow = state.filters.components.entities;

        if (entitesToShow.length === 0) {
            this.node.attr('opacity', 0);
            return;
        }

        const visibleNodes: INode[] = [];

        this.node.attr('opacity', 0);
        this.node.filter(el => {
            const res = entitesToShow.includes(el.id);
            if (res) {
                visibleNodes.push(el);
            }
            return res;
        }).attr('opacity', 1);

        const visibleNodesWithConnected: INode[] = [...visibleNodes];
        visibleNodes.forEach(node => {
            node.children.forEach(connectedNode => {
                if (visibleNodes.every(visibleNode => visibleNode.children.some(el => el.id === connectedNode.id))) {
                    visibleNodesWithConnected.push(connectedNode);
                }
            });
        });

        this.node
        .filter(el => visibleNodesWithConnected.some(node => node.id === el.id))
        .attr('opacity', 1);

        setVisibleNodes(visibleNodes);
    }
}

export default NodeModel;