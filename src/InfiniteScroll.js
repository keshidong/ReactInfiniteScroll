import React, { Component } from 'react';
import PropTypes from 'prop-types';


class InfiniteScroll extends Component {
    // cache calculated items, not all items
    items_ = {};
    RUNWAY_ITEMS = 20;
    RUNWAY_ITEMS_OPPOSITE = 10;

    state = {
        anchorItem: { index: 0, offset: 0 },
        ifScrollUp: false,
    }

    handleScroll = () => {
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

        // update view
        this.setState({
            ifScrollUp,
            anchorItem,
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
        const { anchorItem } = this.state;

        if (this.items_[i].height) {
            return item[i].height;
        }

        if (anchorItem.index - this.RUNWAY_ITEMS + i < 0) {
            throw new Error('getItemHeight params index must greater or equal to 0');
        }

        const itemHeight = this.scroller_[anchorItem.index - this.RUNWAY_ITEMS + i].offsetHeight;
        // cache height
        this.items_[i].height = itemHeight;
        return itemHeight;
    }
    render() {
        return (
            <div
                onScroll={this.handleScroll}
                ref={(dom) => { this.scroller_ = dom; }}
            >
                {this.props.children(this.state.anchorItem.index)}
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
