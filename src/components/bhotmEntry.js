class BhotmEntry extends React.Component {
    render() {
        return (
            <div>
                <h1>
                    {this.props.entry.name} - {this.props.entry.entryName}
                </h1>
            </div>
        );
    }
}

const _BhotmEntry = BhotmEntry;
export { _BhotmEntry as BhotmEntry };
