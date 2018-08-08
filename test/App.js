import React, { Component } from 'react'
import InfiniteScroll from '../src/InfiniteScroll'

class App extends Component {
    state = {
        list: []
    }

    handleLoadMore = () => {
        this.setState({
            list: this.state.concat([])
        })
    }

    render() {
        return (
            <InfiniteScroll
                onHonHitScrollBottom={this.handleLoadMore}
            >

            </InfiniteScroll>
        )
    }
}

export default App
