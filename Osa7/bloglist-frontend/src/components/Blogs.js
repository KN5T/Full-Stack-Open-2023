import { Link } from "react-router-dom"

import { TableContainer, Table, TableBody, TableRow, TableCell, Paper } from "@mui/material"

const Blogs = ({ blogs }) => {

    const sortedBlogs = blogs.slice().sort((a, b) => {
      return b.likes - a.likes
    })

    return (
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {sortedBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
}

export default Blogs