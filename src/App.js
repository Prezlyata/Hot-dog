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
			taskTitle: ''
		};
	}

	componentDidMount() {
		this.getTasks();
	}

	getTasks = () => {
		axios
			.get('http://localhost:5000/tasks')
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
				.post('http://localhost:5000/tasks', { title: taskTitle })
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
			.delete(`http://localhost:5000/tasks:${id}`)
			.then((res) => {
				console.log(res);
				this.getTasks();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onTodoChange(value) {
		this.setState({
			taskTitle: value
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
								<button type="button" className="btn btn-danger" onClick={(e) => this.deleteTask(e)}>
									Delete
								</button>
							</div>
						);
					})}
				</div>
			);
		}
	};

	render() {
		console.log(this.state);
		return (
			<div className="App">
				<div className="app-form">
					<input
						type="text"
						className="form-control"
						placeholder="name"
						onChange={(e) => this.onTodoChange(e.target.value)}
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
