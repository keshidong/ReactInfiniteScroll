import React, { Component } from 'react';
import PropTypes from 'prop-types';

// todo 根据数据视图恢复
class InfiniteScroll extends Component {
    // cache calculated items, not all items
    itemsHeightCache_ = [];
    RUNWAY_ITEMS = 20;
    RUNWAY_ITEMS_OPPOSITE = 10;

    anchorScrollTop = 0;

    // the item node del or the scroller padding change will trigger onScroll event
    ifFreezeScroll = false;

    state = {
        // 放在state主要是用于之后的数据视图恢复
        ifRunWayUp: false,
        anchorItem: { index: 0, offset: 0 },
    }

    getRenderedStartIndex = (ifRunWayUp, anchorItem) => {
        // todo cache?
        return ifRunWayUp
            ? Math.max(anchorItem.index - this.RUNWAY_ITEMS, 0)
            : Math.max(anchorItem.index - this.RUNWAY_ITEMS_OPPOSITE, 0);
    }

    getRenderedEndIndex = (ifRunWayUp, anchorItem) => {
        // not pure func
        // todo
        if (!this.scroller_) return this.RUNWAY_ITEMS;
        const lastScreenItem = this.calculateAnchoredItem(anchorItem, this.scroller_.offsetHeight);

        return ifRunWayUp
            ? Math.min(lastScreenItem.index + this.RUNWAY_ITEMS_OPPOSITE, this.itemsHeightCache_.length - 1)
            : Math.min(lastScreenItem.index + this.RUNWAY_ITEMS, this.itemsHeightCache_.length - 1)
    }

    handleScroll = () => {
        if (this.ifFreezeScroll) return;

        debugger

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

        // 计算滚动差异

        this.anchorScrollTop = this.scroller_.scrollTop;
        // const lastScreenItem = this.calculateAnchoredItem(anchorItem, this.scroller_.offsetHeight);

        // 判断last Screen item 是否为接近最后的item
        const ifScrollUp = delta < 0;

        // todo 5 will be var
        console.log(this.getRenderedEndIndex(ifScrollUp, anchorItem));
        console.log('itemsHeightCache_', this.itemsHeightCache_.length);
        if (!ifScrollUp && this.getRenderedEndIndex(ifScrollUp, anchorItem) >= this.itemsHeightCache_.length - 5) {
            this.props.onLoadMore();
        }

        // update view
        this.setState({
            anchorItem,
            ifRunWayUp: delta < 0,
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
            while (delta < 0 && i > 0 && this.itemsHeightCache_[i - 1]) {
                delta += this.itemsHeightCache_[i - 1];
                i--;
            }
        } else {
            while (delta > 0 && i < maxItemCount && this.itemsHeightCache_[i] && this.itemsHeightCache_[i] < delta) {
                delta -= this.itemsHeightCache_[i];
                i++;
            }
            if (i >= maxItemCount || !this.itemsHeightCache_[i]) {
                // todo
                // load more data
            }

        }
        return {
            index: i,
            offset: delta,
        };
    }

    keepScrollBar = (
        renderedStartIndex,
        renderedEndIndex,
     ) => {
        // after itemsHeightCache_ be updated
        // set container padding
        // this.scroller_.style.paddingTop = `${this.itemsHeightCache_
        //     .slice(0, renderedStartIndex)
        //     .reduce((pre, cur) => (pre + cur), 0)}px`;

        this.scroller_.style.paddingBottom = `${this.itemsHeightCache_
            .slice(renderedEndIndex + 1)}px`;
    }

    calculateCacheItemHeight = () => {
        // cache list height
        const { ifRunWayUp, anchorItem } = this.state;
        const start = this.getRenderedStartIndex(ifRunWayUp, anchorItem);

        Array.prototype.forEach.call(this.scroller_.children, (item, index) => {
            if (start + index >= this.itemsHeightCache_.length) {
                // add new item
                this.itemsHeightCache_[index + start] = item.offsetHeight;
            }
        });
    }

    componentWillUpdate() {
        this.ifFreezeScroll = true;
    }

    componentDidMount() {
        this.calculateCacheItemHeight();
        // console.log(this.scroller_.scrollHeight);
        // this.scrollRunway_.style.transform = 'translate(0, ' + this.scrollRunwayEnd_ + 'px)';
    }
    componentDidUpdate() {
        const { ifRunWayUp, anchorItem } = this.state;
        this.calculateCacheItemHeight();
        this.keepScrollBar(this.getRenderedStartIndex(ifRunWayUp, anchorItem),
            this.getRenderedEndIndex(ifRunWayUp, anchorItem));
        this.ifFreezeScroll = false;
    }
    render() {
        const { ifRunWayUp, anchorItem } = this.state;

        const start = this.getRenderedStartIndex(ifRunWayUp, anchorItem);
        const end = this.getRenderedEndIndex(ifRunWayUp, anchorItem);
        console.log('start', start, 'end', end);
        return (
            <div
                style={{
                    position: 'relative',
                    ...this.props.style,
                    paddingTop: `${this.itemsHeightCache_
                        .slice(0, start)
                        .reduce((pre, cur) => (pre + cur), 0)}px`,
                }}
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
