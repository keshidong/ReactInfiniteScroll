import React, { Component } from 'react';
import PropTypes from 'prop-types';


class InfiniteScroll extends Component {
    // cache calculated items, not all items
    itemsHeightCache_ = [];
    RUNWAY_ITEMS = 20;
    RUNWAY_ITEMS_OPPOSITE = 10;

    state = {
        start: 0,
        end: this.RUNWAY_ITEMS,

        // 放在state主要是用于之后的数据视图恢复
        anchorItem: { index: 0, offset: 0 },
    }

    handleScroll = () => {
        const { maxItemCount } = this.props;

        var delta = this.scroller_.scrollTop - this.anchorScrollTop;
        let anchorItem;
        // Special case, if we get to very top, always scroll to top.
        if (this.scroller_.scrollTop === 0) {
            anchorItem = { index: 0, offset: 0 };
            // this.setState({
            //     anchorItem: { index: 0, offset: 0 },
            // })
        } else {
            anchorItem = this.calculateAnchoredItem(this.state.anchorItem, delta);
        }
        this.anchorScrollTop = this.scroller_.scrollTop;
        const lastScreenItem = this.calculateAnchoredItem(anchorItem, this.scroller_.offsetHeight);

        // 判断last Screen item 是否为接近最后的item
        const ifScrollUp = delta < 0;

        console.log(ifScrollUp);
        if (!ifScrollUp && lastScreenItem.index + this.RUNWAY_ITEMS >= maxItemCount) {
            this.props.onLoadMore();
        }

        // update view
        this.setState({
            anchorItem,

            start: ifScrollUp
                ? Math.max(anchorItem.index - this.RUNWAY_ITEMS, 0)
                : Math.max(anchorItem.index - this.RUNWAY_ITEMS_OPPOSITE, 0),
            end: ifScrollUp
                ? Math.min(lastScreenItem.index + this.RUNWAY_ITEMS_OPPOSITE, maxItemCount)
                : Math.min(lastScreenItem.index + this.RUNWAY_ITEMS, maxItemCount)
        });
            // this.fill(this.anchorItem.index - RUNWAY_ITEMS, lastScreenItem.index + RUNWAY_ITEMS_OPPOSITE);
            // this.fill(this.anchorItem.index - RUNWAY_ITEMS_OPPOSITE, lastScreenItem.index + RUNWAY_ITEMS);

    }
    calculateAnchoredItem = (initialAnchor, delta) => {
        const { maxItemCount } = this.props;

        if (delta === 0)
            return initialAnchor;

        delta += initialAnchor.offset;
        let i = initialAnchor.index;

        if (delta < 0) {
            while (delta < 0 && i > 0 && this.getItemHeight(i - 1)) {
                delta += this.getItemHeight(i - 1);
                i--;
            }
        } else {
            while (delta > 0 && i < maxItemCount && this.getItemHeight(i) && this.getItemHeight(i) < delta) {
                delta -= this.getItemHeight(i);
                i++;
            }
            if (i >= maxItemCount || !this.getItemHeight(i)) {
                // todo
                // load more data
            }

        }
        return {
            index: i,
            offset: delta,
        };
    }

    getItemHeight = (i) => {
        const { start, end } = this.state;

        if (this.itemsHeightCache_[i]) {
            return this.itemsHeightCache_[i];
        }

        if (i >= start && i <= end) {
            // 节点在渲染状态
            console.log(i, start, end);
            const itemHeight = this.scroller_.children[i - start].offsetHeight;
            // cache height
            this.itemsHeightCache_[i] = itemHeight;
            return itemHeight;
        }
        
        console.log(i, start, end);

        throw new Error('节点即没有被缓存过，也不在渲染状态');
    }

    calculateCacheItemHeight = () => {
        // cache list height
        const { start } = this.state;
        this.scroller_.children.forEach((item, index) => {
            // todo 可能重复计算
            this.itemsHeightCache_[index + start] = item.offsetHeight;
        });
    }

    componentDidMount() {
        this.calculateCacheItemHeight();
    }
    componentDidUpdate() {
        this.calculateCacheItemHeight();
    }
    render() {
        const { start, end } = this.state;
        return (
            <div
                style={this.props.style}
                onScroll={this.handleScroll}
                ref={(dom) => { this.scroller_ = dom; }}
            >
                {
                    this.props.children(start, end)
                }
            </div>
        );
    }
}

InfiniteScroll.propTypes = {
    maxItemCount: PropTypes.number,
    onLoadMore: PropTypes.func,
    children: PropTypes.func,
    style: PropTypes.shape({}),
};
InfiniteScroll.defaultProps = {
    maxItemCount: 0,
    onLoadMore: () => {},
    children: () => {},
    style: {},
};

export default InfiniteScroll;
