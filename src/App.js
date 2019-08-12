import React, { Component } from 'react';
import './App.scss';
import axios from 'axios';
import picture from './img/picture.jpg';

class App extends Component {
	constructor() {
		super();
		this.state = {
			tasks: null,
			loading: true,
			taskTitle: '',
			updateTitle: ''
		};
	}

	componentDidMount() {
		this.getTasks();
	}

	getTasks = () => {
		axios
			//.get('http://localhost:5000/hotdoglist')
			.get('/hotdoglist')
			.then((response) => {
				this.setState({
					tasks: response.data,
					loading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	addTask = () => {
		const { taskTitle } = this.state;

		if (taskTitle.length) {
			axios
				.post('/hotdoglist', { title: taskTitle })
				.then((res) => {
					console.log(res);
					this.getTasks();
					this.setState({
						taskTitle: ''
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	deleteTask = (e) => {
		let id = e.target.parentNode.getAttribute('data-id');

		axios
			.delete(`/hotdoglist:${id}`)
			.then((res) => {
				console.log(res);
				this.getTasks();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	updateTask = (e) => {
		let id = e.target.parentNode.getAttribute('data-id');
		const { updateTitle } = this.state;
		axios
			.put(`/hotdoglist:${id}`, { title: updateTitle })
			.then((res) => {
				console.log(res);
				this.getTasks();
				this.setState({ updateTitle: '' });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onTitleChange(value) {
		this.setState({
			taskTitle: value
		});
	}

	onUpdateTitleChange(value) {
		this.setState({
			updateTitle: value
		});
	}

	renderList = () => {
		if (!this.state.loading) {
			return (
				<div className="list">
					{this.state.tasks.map((task, index) => {
						return (
							<div className="list-task" key={index} data-id={task._id}>
								<img src={picture} alt="picture" />
								<p className="list-group-item list-group-item-action" key={index}>
									{task.title}
								</p>
								<input
									type="text"
									className="form-control"
									placeholder="name"
									onChange={(e) => this.onUpdateTitleChange(e.target.value)}
									value={this.state.updateTitle}
								/>
								<button type="button" className="btn btn-danger" onClick={(e) => this.deleteTask(e)}>
									Delete
								</button>
								<button type="button" className="btn btn-warning" onClick={(e) => this.updateTask(e)}>
									Update
								</button>
							</div>
						);
					})}
				</div>
			);
		}
	};

	render() {
		//this.updateTask();
		console.log(this.state);
		return (
			<div className="App">
				<div className="app-form">
					<input
						type="text"
						className="form-control"
						placeholder="name"
						onChange={(e) => this.onTitleChange(e.target.value)}
						value={this.state.taskTitle}
					/>
					<button type="submit" className="btn btn-primary" onClick={this.addTask}>
						Create
					</button>
				</div>
				{this.renderList()}
			</div>
		);
	}
}

export default App;
